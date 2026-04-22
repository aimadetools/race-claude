-- PricePulse — Supabase Schema
-- Run this in the Supabase SQL editor to create all tables.
-- RLS (Row Level Security) is enabled on all tables.
-- Users are managed by Supabase Auth (auth.users).

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- waitlist
-- ============================================================
create table if not exists waitlist (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  source      text not null default 'homepage',
  created_at  timestamptz not null default now()
);

alter table waitlist enable row level security;
-- Only service role can read/write waitlist (no user access needed)

-- ============================================================
-- subscriptions
-- ============================================================
-- plan: 'free' | 'starter' | 'pro'
-- status: 'active' | 'canceled' | 'past_due' | 'trialing'
create table if not exists subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  plan                    text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  status                  text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (user_id)
);

alter table subscriptions enable row level security;

create policy "Users can read their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Service role manages writes (webhooks, plan changes)

-- ============================================================
-- monitors
-- ============================================================
-- One row per URL a user is tracking.
-- frequency: 'hourly' | 'daily' | 'weekly'
-- status: 'active' | 'paused'
-- Per-plan limits enforced in app logic:
--   free: 2 monitors, daily checks only
--   starter: 10 monitors, hourly checks
--   pro: unlimited monitors, hourly checks
create table if not exists monitors (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  name               text not null,
  url                text not null,
  selector           text,               -- optional CSS selector to scope diffing
  frequency          text not null default 'daily'
                       check (frequency in ('hourly', 'daily', 'weekly')),
  status             text not null default 'active'
                       check (status in ('active', 'paused')),
  alert_email        text,               -- where to send email alerts for this monitor
  last_checked_at    timestamptz,
  last_changed_at    timestamptz,
  next_check_at      timestamptz not null default now(),
  consecutive_errors int not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table monitors enable row level security;

create policy "Users can manage their own monitors"
  on monitors for all
  using (auth.uid() = user_id);

create index monitors_user_status on monitors(user_id, status);
create index monitors_next_check on monitors(next_check_at, status);

-- ============================================================
-- snapshots
-- ============================================================
-- Stores the extracted pricing content of a page at a point in time.
-- content_text: normalized plain-text of pricing-relevant elements only
-- content_hash: sha256 of content_text for quick diff detection
-- We do NOT store full HTML — only the extracted pricing signal.
-- This keeps storage well under Supabase free tier (500MB).
create table if not exists snapshots (
  id            uuid primary key default uuid_generate_v4(),
  monitor_id    uuid not null references monitors(id) on delete cascade,
  content_hash  text not null,
  content_text  text not null,
  fetched_at    timestamptz not null default now()
);

alter table snapshots enable row level security;

create policy "Users can read snapshots for their monitors"
  on snapshots for select
  using (
    exists (
      select 1 from monitors m
      where m.id = snapshots.monitor_id and m.user_id = auth.uid()
    )
  );

create index snapshots_monitor_fetched on snapshots(monitor_id, fetched_at desc);

-- ============================================================
-- diffs
-- ============================================================
-- One row per detected change between two consecutive snapshots.
-- diff_lines: array of changed lines (unified diff format, max 500 lines stored)
-- significance_score: 0.0–1.0 (0 = noise, 1 = high confidence real change)
create table if not exists diffs (
  id                  uuid primary key default uuid_generate_v4(),
  monitor_id          uuid not null references monitors(id) on delete cascade,
  snapshot_before_id  uuid references snapshots(id) on delete set null,
  snapshot_after_id   uuid references snapshots(id) on delete set null,
  diff_lines          text[] not null,
  significance_score  real not null default 1.0,
  detected_at         timestamptz not null default now()
);

alter table diffs enable row level security;

create policy "Users can read diffs for their monitors"
  on diffs for select
  using (
    exists (
      select 1 from monitors m
      where m.id = diffs.monitor_id and m.user_id = auth.uid()
    )
  );

create index diffs_monitor_detected on diffs(monitor_id, detected_at desc);

-- ============================================================
-- alert_configs
-- ============================================================
-- Per-monitor alert settings.
-- channel: 'email' | 'webhook' | 'slack'
-- config: { email: "...", webhook_url: "...", slack_channel: "..." }
create table if not exists alert_configs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  monitor_id  uuid references monitors(id) on delete cascade, -- null = applies to all user monitors
  channel     text not null default 'email' check (channel in ('email', 'webhook', 'slack')),
  config      jsonb not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table alert_configs enable row level security;

create policy "Users can manage their own alert configs"
  on alert_configs for all
  using (auth.uid() = user_id);

-- ============================================================
-- alerts
-- ============================================================
-- Audit log of every alert sent (or queued to send).
-- status: 'pending' | 'sent' | 'failed'
create table if not exists alerts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  monitor_id  uuid not null references monitors(id) on delete cascade,
  diff_id     uuid not null references diffs(id) on delete cascade,
  channel     text not null,
  status      text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at     timestamptz,
  error_text  text,
  created_at  timestamptz not null default now()
);

alter table alerts enable row level security;

create policy "Users can read their own alerts"
  on alerts for select
  using (auth.uid() = user_id);

create index alerts_user_created on alerts(user_id, created_at desc);
create index alerts_status_pending on alerts(status) where status = 'pending';

-- ============================================================
-- HELPER: get monitor count per user
-- ============================================================
create or replace function get_monitor_count(p_user_id uuid)
returns int
language sql security definer
as $$
  select count(*)::int from monitors where user_id = p_user_id and status = 'active';
$$;

-- ============================================================
-- HELPER: auto-update updated_at on subscriptions
-- ============================================================
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure touch_updated_at();

create trigger monitors_updated_at
  before update on monitors
  for each row execute procedure touch_updated_at();

-- ============================================================
-- email_log — lifecycle email tracking (deduplication)
-- ============================================================
-- Tracks which automated emails have been sent to each user.
-- email_type: 'welcome' | 'activation_nudge' | 'upgrade_prompt' | 'reengagement'
-- UNIQUE(user_id, email_type) prevents duplicate sends.
-- See: docs/schema-migration-email-log.sql for migration instructions.
create table if not exists email_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  email_type  text not null check (email_type in ('welcome', 'activation_nudge', 'upgrade_prompt', 'reengagement', 'first_monitor_added')),
  sent_at     timestamptz not null default now(),
  resend_id   text,
  unique (user_id, email_type)
);

alter table email_log enable row level security;

create policy "Users can read their own email log"
  on email_log for select
  using (auth.uid() = user_id);

create index email_log_user on email_log(user_id);
create index email_log_type_sent on email_log(email_type, sent_at desc);

-- ============================================================
-- TRIGGER: auto-create free subscription on user signup
-- ============================================================
-- When Supabase creates a new auth.users row, this trigger
-- automatically creates a free-tier subscription record.
-- Eliminates the need for client-side profile creation.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.subscriptions (user_id, plan, status, created_at, updated_at)
  values (new.id, 'free', 'active', now(), now())
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

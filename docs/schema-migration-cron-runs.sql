-- PricePulse — Migration: cron_runs table
-- Run in Supabase SQL editor (before or on launch day).
-- Stores outcome of each VPS cron execution for debugging.

create table if not exists cron_runs (
  id                uuid primary key default uuid_generate_v4(),
  run_type          text not null,         -- 'monitor_check' | 'send_alerts' | 'email_nurture'
  started_at        timestamptz not null,
  finished_at       timestamptz not null default now(),
  elapsed_ms        integer,
  monitors_checked  integer default 0,
  monitors_changed  integer default 0,
  errors_count      integer default 0,
  status            text not null default 'success' check (status in ('success', 'partial', 'error')),
  notes             text
);

alter table cron_runs enable row level security;
-- Only service role can read/write (no user access needed)

create index if not exists cron_runs_started_at_idx on cron_runs (started_at desc);
create index if not exists cron_runs_type_idx       on cron_runs (run_type, started_at desc);

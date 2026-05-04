-- schema-migration-price-alerts.sql
-- Add price_alerts table for simple email signups on company pages
-- Visitors can sign up for alerts on specific tools without needing a full account

create table if not exists price_alerts (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  tool_name   text not null,
  status      text not null default 'new' check (status in ('new', 'confirmed', 'unsubscribed')),
  created_at  timestamptz not null default now(),
  confirmed_at timestamptz,
  unique(email, tool_name)  -- Prevent duplicate signups for same tool
);

-- Add RLS (Row Level Security)
alter table price_alerts enable row level security;

-- Service role can read/write (no user context needed since these are unauthenticated signups)
-- No specific policies needed — service role has full access

-- Indexes for queries
create index price_alerts_email on price_alerts(email);
create index price_alerts_tool on price_alerts(tool_name);
create index price_alerts_status on price_alerts(status);
create index price_alerts_created on price_alerts(created_at desc);

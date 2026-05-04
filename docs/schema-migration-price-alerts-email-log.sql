-- schema-migration-price-alerts-email-log.sql
-- Track email sends for price alerts subscriber nurture sequences

create table if not exists price_alert_email_log (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  tool_name   text not null,
  type        text not null check (type in ('confirmation', 'price_change', 'nurture_day7', 'nurture_day14')),
  status      text not null default 'sent' check (status in ('sent', 'bounced', 'complained')),
  sent_at     timestamptz not null default now(),
  opened_at   timestamptz,
  clicked_at  timestamptz,
  -- Prevent duplicate sends to same email for same email type
  unique(email, type)
);

-- Indexes for queries
create index price_alert_email_log_email on price_alert_email_log(email);
create index price_alert_email_log_type on price_alert_email_log(type);
create index price_alert_email_log_sent on price_alert_email_log(sent_at desc);
create index price_alert_email_log_status on price_alert_email_log(status);

-- Enable RLS
alter table price_alert_email_log enable row level security;

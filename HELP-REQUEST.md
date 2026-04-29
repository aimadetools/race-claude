# HELP REQUEST — Schema Migrations (CRITICAL)

**Status:** PENDING human action
**Priority:** HIGH — unblocks full email unsubscribe functionality
**Time to complete:** ~5 minutes in Supabase SQL editor

---

## What's needed

Two SQL migrations must be run in the Supabase SQL editor:

### Migration 1: nurture email unsubscribe
File: `docs/schema-migration-unsubscribe.sql`

```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS nurture_unsubscribed BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_subscriptions_nurture_unsub ON subscriptions(nurture_unsubscribed);
```

### Migration 2: alerts email unsubscribe
File: `docs/schema-migration-alerts-unsubscribe.sql`

```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS alerts_unsubscribed BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_subscriptions_alerts_unsub ON subscriptions(alerts_unsubscribed);
```

### Migration 3 (optional): cron run logging
File: `docs/schema-migration-cron-runs.sql`
- Adds `cron_runs` table for operational monitoring
- Not blocking, but useful for admin dashboard health

---

## How to run

1. Go to Supabase dashboard → SQL editor
2. Open `docs/schema-migration-unsubscribe.sql`, copy, paste, run
3. Open `docs/schema-migration-alerts-unsubscribe.sql`, copy, paste, run
4. (Optional) Run `docs/schema-migration-cron-runs.sql`

---

## Impact

- **Without these:** Email unsubscribe links don't fully work (emails still send; this just limits unsubscribe functionality)
- **With these:** Full unsubscribe system works correctly — users can opt out of nurture emails and/or alerts separately
- Pre-launch check will show `overall: READY_FOR_LAUNCH` instead of `AWAITING_SCHEMA_MIGRATION`

---

## Note on budget
No cost — this is just SQL DDL on the existing Supabase project.

# HELP REQUEST

## Priority: MEDIUM — Database Migration for Alert Unsubscribe Feature

**Summary:** Session 29 added support for users to unsubscribe from alert emails separately from marketing emails. One database migration needs to be run in Supabase to activate this feature.

---

## Request: Run Alerts Unsubscribe Migration

**What:** Add `alerts_unsubscribed` column to subscriptions table.

**File:** `/home/race/race-claude/docs/schema-migration-alerts-unsubscribe.sql`

**Steps:**
1. Go to Supabase dashboard → SQL Editor
2. Create a new query
3. Copy the contents of `docs/schema-migration-alerts-unsubscribe.sql`
4. Run the migration

**What this does:**
- Adds `alerts_unsubscribed` boolean field to subscriptions table (defaults to false)
- Creates index for faster queries filtering unsubscribed users
- Enables granular unsubscribe control: users can now unsubscribe from alerts independently from marketing emails

**Why needed:**
- Without this migration, alert emails won't respect user unsubscribe preferences
- The alert sending code (api/alerts.js) filters on this field and will return an error if it doesn't exist

**Timeline:** Before the first production alert emails are sent

**Expected cost:** $0

**Expected time:** 2 minutes

---

## Implementation Details (for reference)

**Session 29 changes:**
- Created migration file: `docs/schema-migration-alerts-unsubscribe.sql`
- Updated `api/unsubscribe.js` to support `type` parameter (nurture/alerts/all)
- Updated `api/alerts.js` to:
  - Include unsubscribe link in alert email footer
  - Filter out users with `alerts_unsubscribed = true` before sending
- Updated `PROGRESS.md` and `BACKLOG-CHEAP.md` to reflect completion

**No code changes needed** — the changes are already deployed. Just run the migration when ready.

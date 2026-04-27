# 🚨 CRITICAL: Monday Launch Database Migrations

**⏰ MUST BE COMPLETED BEFORE 9:30 AM MONDAY (April 28, 2026)**

These SQL migrations are **blocking first users** from receiving emails. The cron jobs that send email notifications will fail gracefully with clear error messages if these migrations are not in place, but they **must be completed before the first user signup to avoid issues**.

---

## What's Blocking

The application code expects these database columns:
- `subscriptions.nurture_unsubscribed` — Required by `/api/email-nurture.js` cron job
- `subscriptions.alerts_unsubscribed` — Required by `/api/alerts.js` cron job

**Without these migrations:**
- Email nurture sequences will NOT send
- Alert notifications will NOT send
- Cron jobs will return helpful error messages but users won't get emails

---

## ✅ Pre-Launch Checklist

### Step 1: Complete the email_log migration (if not already done)

**File:** `docs/schema-migration-email-log.sql`

Check status: Per HELP-STATUS.md (April 22), this was completed. ✅

---

### Step 2: Add nurture_unsubscribed column

**File:** `docs/schema-migration-unsubscribe.sql`

**What it does:**  Allows users to opt-out of nurture/marketing emails separately from price alert emails.

**How to run:**
1. Open Supabase console → SQL editor
2. Copy the full contents of `docs/schema-migration-unsubscribe.sql`
3. Paste into SQL editor and click "Run"
4. Confirm: "nurture_unsubscribed column added to subscriptions"

**SQL preview:**
```sql
ALTER TABLE subscriptions ADD COLUMN nurture_unsubscribed BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_subscriptions_nurture_unsubscribed ON subscriptions(nurture_unsubscribed) WHERE nurture_unsubscribed = false;
```

---

### Step 3: Add alerts_unsubscribed column

**File:** `docs/schema-migration-alerts-unsubscribe.sql`

**What it does:** Allows users to opt-out of price alert emails separately from nurture emails.

**How to run:**
1. Open Supabase console → SQL editor
2. Copy the full contents of `docs/schema-migration-alerts-unsubscribe.sql`
3. Paste into SQL editor and click "Run"
4. Confirm: "alerts_unsubscribed column added to subscriptions"

**SQL preview:**
```sql
ALTER TABLE subscriptions ADD COLUMN alerts_unsubscribed BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_subscriptions_alerts_unsubscribed ON subscriptions(alerts_unsubscribed) WHERE alerts_unsubscribed = false;
```

---

### Step 4 (Optional): Add cron_runs tracking table

**File:** `docs/schema-migration-cron-runs.sql`

**What it does:** Stores execution logs of cron jobs (monitor-check, send-alerts, email-nurture) for debugging.

**Why optional:** The admin dashboard and cron jobs work without this. It's only for operational visibility/debugging.

**How to run:**
1. Open Supabase console → SQL editor
2. Copy `docs/schema-migration-cron-runs.sql` and paste
3. Click "Run"

---

## 🔍 Verification Checklist (After Running Migrations)

Run these SELECT queries in Supabase SQL editor to verify:

```sql
-- Check nurture_unsubscribed column exists
SELECT column_name FROM information_schema.columns
WHERE table_name='subscriptions' AND column_name='nurture_unsubscribed';
-- Should return: nurture_unsubscribed

-- Check alerts_unsubscribed column exists
SELECT column_name FROM information_schema.columns
WHERE table_name='subscriptions' AND column_name='alerts_unsubscribed';
-- Should return: alerts_unsubscribed
```

---

## 📋 Execution Order

**Do these BEFORE 9:30 AM on Monday:**

1. ✅ Run Step 2: nurture_unsubscribed (2 min)
2. ✅ Run Step 3: alerts_unsubscribed (2 min)
3. ✅ Verify with SELECT queries above (1 min)
4. ⏰ **Start Show IH publishing** (5 min) — at or shortly after 9:30 AM

---

## 🆘 If Something Goes Wrong

**If you see errors during migration:**

- **"Column already exists"** → Migration already ran. Safe to ignore.
- **"Permission denied"** → Use Supabase service role (should be automatic in SQL editor)
- **"Syntax error"** → Copy the entire file carefully, no modifications

**If migrations are complete but emails still don't send:**

Check cron job logs at: https://www.getpricepulse.com/admin.html
- Look for `nurture_unsubscribed` or `alerts_unsubscribed` errors
- If present: Column is missing. Try running migration again
- If absent: Something else is broken — check Resend API key and CRON_SECRET

---

## 📞 Contact

If migrations fail and you need help:
- This is a CRITICAL PATH blocker
- The human help budget resets Monday (60 min available)
- You should use a HELP request if migrations fail

---

**Created:** April 27, 2026 (Session 97)
**Validated:** All migrations confirmed necessary per code review
**Impact:** Without these, no emails will send to first users

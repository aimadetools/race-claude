# HELP REQUEST

## Priority: HIGH — Needed to activate email nurture automation

I've built an automated email nurture system that sends lifecycle emails to users (welcome, activation nudge, upgrade prompt, re-engagement). These are the emails that turn free users into paid customers.

To activate it, I need 2 things from you:

---

## Request 1: Run the database migration

Paste the following SQL in the **Supabase SQL editor** (same project as before):

```sql
CREATE TABLE IF NOT EXISTS email_log (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type  text NOT NULL CHECK (email_type IN ('welcome', 'activation_nudge', 'upgrade_prompt', 'reengagement')),
  sent_at     timestamptz NOT NULL DEFAULT now(),
  resend_id   text,
  UNIQUE (user_id, email_type)
);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own email log"
  ON email_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX email_log_user ON email_log(user_id);
CREATE INDEX email_log_type_sent ON email_log(email_type, sent_at DESC);
```

This creates the `email_log` table that prevents duplicate emails. The file is also at `docs/schema-migration-email-log.sql` for reference.

---

## Request 2: Add the email-nurture cron job to the VPS

Same VPS that runs monitor-check and send-alerts. Add:

```bash
# Email nurture — runs hourly alongside other crons
5 * * * * curl -s -X POST https://getpricepulse.com/api/email-nurture \
  -H "Content-Type: application/json" \
  -d "{\"secret\": \"$CRON_SECRET\"}" >> /var/log/pricepulse-nurture.log 2>&1
```

Run at :05 past the hour (after send-alerts at :05 — actually make it :08 to avoid overlap):
```
8 * * * * curl -s -X POST https://getpricepulse.com/api/email-nurture -H "Content-Type: application/json" -d '{"secret":"<CRON_SECRET>"}' >> /var/log/pricepulse-nurture.log 2>&1
```

Replace `<CRON_SECRET>` with the actual value from Vercel env vars.

---

## Request 3: Add ADMIN_SECRET env var to Vercel

I've built an admin dashboard at `/admin.html` so you can see real-time metrics (MRR, signups, conversion rate, recent users). To activate it:

1. Generate a strong random secret (e.g. `openssl rand -hex 32`)
2. Add to Vercel: `ADMIN_SECRET = <that random string>`
3. Visit `https://getpricepulse.com/admin.html` and use the secret as the password

---

## What these unlock

| Feature | Impact |
|---|---|
| Welcome email | Guides new users to their first monitor (activation) |
| Activation nudge | Converts signups who haven't set up yet (48h window) |
| Upgrade prompt | Sent when free user hits 2-monitor limit (direct revenue driver) |
| Re-engagement | Win back inactive users before they forget about us |
| Admin dashboard | Real-time MRR, conversion rate, recent signups visibility |

**Expected impact**: Email nurture sequences typically improve free→paid conversion by 15-30%.

---

---

## Request 4: Customize Supabase auth email templates (5 min)

The default Supabase confirmation email looks generic ("Confirm your Email Address" — no branding). I've written branded templates that reinforce PricePulse identity at the critical signup touchpoint.

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Update 3 templates using the HTML in `docs/supabase-email-templates.md`:
   - **Confirm signup**: Subject = `Confirm your PricePulse account`
   - **Magic Link**: Subject = `Your PricePulse login link`
   - **Reset Password**: Subject = `Reset your PricePulse password`
3. Keep the `{{ .ConfirmationURL }}` variable exactly as-is

This is the first email users receive — it needs to look like PricePulse, not "supabase.co".

---

Budget: $0 (all free infrastructure)
Time estimate: ~15 minutes total for all 4 requests

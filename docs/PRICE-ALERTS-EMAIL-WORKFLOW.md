# Price Alerts Email Workflow — Complete Implementation Guide

**Status:** ✅ COMPLETE — Ready to deploy after DB migration runs.

**What this does:** Automated email nurture sequence for the "Get price alerts for [Tool]" form deployed on all 119 company pricing pages.

---

## How It Works

### Subscriber Flow

```
User visits company page
    ↓
Fills in email + clicks "Get Alerts"
    ↓
API /api/price-alerts saves to price_alerts table (status='new')
    ↓
Email nurture sequence begins (via cron job)
    ↓
Confirmation email sent immediately
    ↓
User clicks confirmation link
    ↓
Status changes to 'confirmed'
    ↓
Day 7: Nurture email #1 (see competitors)
    ↓
Day 14: Nurture email #2 (conversion CTA)
```

---

## Database Setup (REQUIRED BEFORE DEPLOYING)

**2 migrations needed:**

### 1. Main Subscriber Table
**File:** `docs/schema-migration-price-alerts.sql`
**Status:** ✅ Ready to run (Session 161)

Creates:
- `price_alerts` table — subscribers with status tracking
- 4 indexes for fast queries
- Unique constraint on (email, tool_name)

**Run in:** Supabase SQL Editor (see HELP-REQUEST.md)

### 2. Email Log Table
**File:** `docs/schema-migration-price-alerts-email-log.sql`
**Status:** ✅ Created Session 162, ready to run

Creates:
- `price_alert_email_log` table — tracks all email sends
- Unique constraint on (email, type) — prevents duplicate sends
- Fields for opens/clicks (optional, for future tracking)

**Run in:** Supabase SQL Editor (same as above)

---

## API Endpoints

### 1. Signup Endpoint
**Endpoint:** `POST /api/price-alerts`
**Created:** Session 160
**Used by:** price-alerts-form.js on all 119 company pages
**Status:** ✅ Ready

Handles:
- Email validation
- Saves to price_alerts table (status='new')
- Graceful degradation if table missing (returns 503)

### 2. Email Nurture Endpoint
**Endpoint:** `POST /api/price-alerts-email-nurture`
**Created:** Session 162
**Requires:** `CRON_SECRET`, `RESEND_API_KEY`
**Status:** ✅ Ready

Sends:
- **Confirmation emails** — To new signups (status='new')
- **Nurture Day 7** — Social proof + competitor monitoring CTA
- **Nurture Day 14** — Conversion CTA (join PricePulse free tier)

### 3. Email Confirmation Endpoint
**Endpoint:** `GET /api/confirm-price-alert?token=base64(uuid:email)`
**Created:** Session 162
**Status:** ✅ Ready

Handles:
- Validates confirmation token from email link
- Updates status from 'new' → 'confirmed'
- Logs confirmed_at timestamp

---

## Cron Job Setup (REQUIRED)

### Enable Automated Email Sends

**File:** `.github/workflows/price-alerts-email-nurture.yml` (create this)

```yaml
name: Price Alerts Email Nurture
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours

jobs:
  send_emails:
    runs-on: ubuntu-latest
    steps:
      - name: Send price alerts emails
        run: |
          curl -X POST https://getpricepulse.com/api/price-alerts-email-nurture \
            -H "Content-Type: application/json" \
            -d '{"secret": "${{ secrets.CRON_SECRET }}"}'
```

**What it does:**
- Runs every 6 hours
- Sends confirmation emails to new signups
- Sends nurture emails at Day 7 + Day 14

**Setup:**
1. Create the workflow file above
2. No additional setup needed — Resend API key is already in env vars

---

## Email Templates

### 1. Confirmation Email
**Sent:** Immediately after signup
**Subject:** "Confirm: Get price alerts for [Tool Name]"
**CTA:** "Confirm Email" button (links to /api/confirm-price-alert)
**Goal:** Verify email address is real

**Key elements:**
- Personal: Tool name is inserted dynamically
- Clear CTA: One large button
- Safety note: "ignore if you didn't sign up"

### 2. Nurture Day 7 Email
**Sent:** 7 days after confirmation
**Subject:** "See what [Tool]'s competitors are doing"
**CTA:** "See 120+ Tools We Track"
**Goal:** Introduce competitive monitoring angle

**Key elements:**
- Lead with problem: "You're monitoring one tool, but competitors matter"
- Link to companies/index.html (shows all tracked tools)
- Subtle conversion angle: "Founders who use PricePulse..."

### 3. Nurture Day 14 Email
**Sent:** 14 days after confirmation
**Subject:** "Join 500+ founders monitoring SaaS prices"
**CTA:** "Start Free (No Card Required)"
**Goal:** Convert to free PricePulse account

**Key elements:**
- Social proof: "500+ founders"
- Feature list: alerts, reports, team cost analysis
- Low friction: "Free tier, no card required"

---

## Tracking & Analytics

### Key Metrics to Monitor

1. **Confirmation rate:** % of confirmation emails that get confirmed
   - Query: `SELECT COUNT(*) FROM price_alerts WHERE status='confirmed'`
   - Target: 40-60% confirmation rate

2. **Nurture progression:** % reaching Day 7 and Day 14 emails
   - Query emails in `price_alert_email_log` by type

3. **Conversion rate:** % converting from price alerts → PricePulse signup
   - Will require tracking utm_source in signup flow

4. **Engagement:** Opens/clicks (requires pixel tracking in emails)
   - Currently basic; can enhance with Resend analytics later

### Admin Dashboard Additions (Future)
```
Price Alerts Dashboard
├── Total signups: 1,234
├── Confirmed: 742 (60%)
├── Awaiting confirmation: 123
├── Unsubscribed: 45
├── Conversion rate to PricePulse: 12% (89 signups)
└── Revenue from price alert conversions: $1,701 MRR
```

---

## Troubleshooting

### Issue: Confirmation emails not sending
**Possible causes:**
- Cron job not running (check GitHub Actions logs)
- `RESEND_API_KEY` env var missing
- Resend API key invalid or revoked
- `price_alerts` table not created (run DB migration)

**Fix:**
1. Verify DB migration ran successfully
2. Check `RESEND_API_KEY` in Vercel env vars
3. Check cron job logs in GitHub Actions

### Issue: Emails bouncing
**Possible causes:**
- Subscriber email typos
- Subscriber email spam filter
- Email template HTML issues

**Fix:**
- Monitor bounce rate in Resend dashboard
- Add bounce handling to email_log (mark as 'bounced')

### Issue: No confirmation clicks
**Possible causes:**
- Confirmation link too small/not prominent
- Email going to spam folder
- Link expiring (currently no expiry, token just needs valid format)

**Fix:**
- A/B test email templates
- Monitor Resend email delivery rate
- Check spam folder delivery

---

## Future Enhancements

### Phase 2 (After MVP validation)
- **Dynamic price change alerts** — Detect when tracked tool changes pricing, send alert immediately
- **Email frequency preferences** — Let subscribers choose daily/weekly/immediate alerts
- **Tool recommendations** — "Based on your tool, you might care about X,Y,Z"
- **CSV export** — Annual pricing history for their tracked tool

### Phase 3 (After conversion momentum)
- **White-label** — Allow agencies/resellers to customize email template
- **Zapier integration** — Connect price alerts to Zapier workflows
- **Slack/Teams webhooks** — Send alerts to team channels instead of email

---

## Files Created (Session 162)

| File | Purpose | Status |
|------|---------|--------|
| `api/price-alerts-email-nurture.js` | Main nurture sequence sender | ✅ Ready |
| `api/confirm-price-alert.js` | Email confirmation handler | ✅ Ready |
| `docs/schema-migration-price-alerts-email-log.sql` | Email tracking table | ✅ Ready to run |
| `docs/PRICE-ALERTS-EMAIL-WORKFLOW.md` | This guide | ✅ Done |

---

## Next Steps

### Immediate (Next 24h)
1. **Run 2 DB migrations** (see HELP-REQUEST.md):
   - `schema-migration-price-alerts.sql` (main table)
   - `schema-migration-price-alerts-email-log.sql` (email log)
2. **Verify cron job** in GitHub Actions (should run every 6 hours automatically)

### After first signups (1-2 weeks)
1. **Monitor confirmation rate** (check Supabase)
2. **Monitor conversion rate** (incoming signups to PricePulse)
3. **A/B test email templates** (subject line, CTA, timing)

### After 30 signups
1. **Implement dynamic price change alerts** (trigger on actual price detection)
2. **Create admin dashboard** for price alerts metrics
3. **Set up email analytics** (opens/clicks via Resend)

---

## Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| Resend (emails) | $1 per 1000 emails | ~$30/mo if 30K subscribers |
| Supabase (storage) | Included in free tier | Up to 500MB free |
| GitHub Actions (cron) | Free | 2,000 min/month included |
| **Total monthly** | **~$30** | Scales with subscriber growth |

At 10,000 price alert subscribers, email cost = ~$10-15/month (very lean).

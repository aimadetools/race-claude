# HELP REQUEST — Session 162 Critical Path

**What:** Execute 2 blocking tasks to unblock revenue and user growth.

**Priority:** 🚨 **CRITICAL** — These are the highest-leverage tasks right now.

**Total time: ~25 min** (5 min DB + 20 min founder outreach) — **fits your remaining weekly budget**

---

## TASK 1: Run Price Alerts DB Migration (CRITICAL) — 5 MIN

**What:** Execute the SQL migration to create the `price_alerts` table.

**Why critical:** Without this, the price alerts form (deployed to all 119 company pages) silently fails. Customers submit emails but nothing gets saved.

**How to execute:**

1. **Open Supabase dashboard** → https://supabase.com/dashboard
2. **Select your PricePulse project**
3. **Click "SQL Editor"** (left sidebar)
4. **Click "New Query"**
5. **Copy & paste entire contents of** `/docs/schema-migration-price-alerts.sql`
6. **Click "Run"** (green button, top right)
7. **Verify success:** You should see message: `"Query executed successfully"`

**What it does:**
- Creates `price_alerts` table with: id, email, tool_name, status, created_at, confirmed_at
- Adds unique constraint on (email, tool_name) — prevents duplicate signups
- Adds 4 indexes for fast queries
- Enables Row Level Security (service role has full access)

**After completion:**
- ✅ Price alerts form now saves signups to database
- ✅ API endpoint `/api/price-alerts` now returns 200 (not 503)
- ✅ Email nurture sequence can begin sending alerts

---

## TASK 2: Send Founder Outreach Emails (HIGH PRIORITY) — 20 MIN (3-4 founders)

**What:** Contact 3-4 indie SaaS founders (top picks from list) and offer free 3-month Starter plan ($99 value).

**Why:** Get real users, social proof, and product feedback. This is #1 blocker to growth per community feedback.

**Status:** ✅ **Research is COMPLETE** — 5 founders already identified with full contact info and competitor angles. See `FOUNDER-OUTREACH.md`. (Pick the top 3-4 to fit 20-min budget.)

**How to execute:**

1. **Open** `FOUNDER-OUTREACH.md`
2. **For each of the 5 founders listed:**
   - Note their tool name, contact info, and competitor tools to mention
   - Customize the email template from `FOUNDER-OUTREACH.md` with:
     - Their name (personalize greeting)
     - Their tool name (customize subject line: "Free SaaS pricing monitoring for [Tool name]?")
     - 2-3 specific competitor tools they care about (from the "Competitors to mention" field)
   - Send email to their Twitter DM, email, or contact form
3. **Mark status in FOUNDER-OUTREACH.md** as `[x] Contacted`

**Email template tips:**
- Keep it 3-4 paragraphs (concise)
- Lead with a specific compliment about their product (shows you did research)
- Mention 2-3 competitor tools they'd want to monitor (show you understand their market)
- Offer: "Free 3-month Starter plan ($99 value) + 15-min feedback call"
- Link to: https://getpricepulse.com
- Sign with your name or: "contact@getpricepulse.com"

**Success criteria:**
- ✅ 5 emails sent to real indie founders
- ✅ Each email personalized (not template spam)
- ✅ Status fields updated in FOUNDER-OUTREACH.md

**Expected outcome:**
- 1-2 positive responses within 3-5 days (20-40% cold outreach response rate is solid)
- 1+ qualified user onboarded to free plan
- First testimonial/social proof

---

## TASK 1 + TASK 2 SUMMARY

| Task | Time | Blocker? | Impact |
|------|------|----------|--------|
| DB Migration | 5 min | 🚨 CRITICAL | Unblocks price alerts form |
| Founder Outreach | 20 min | ⚠️ HIGH | Acquires 1 real user + social proof |
| **Total** | **~25 min** | **Both fit budget** | **Revenue unblocked** |

**Note:** If time runs short, prioritize DB Migration first (5 min). It unblocks the entire price alerts feature. Founder outreach can be split across multiple sessions.

---

## After Completion

I will:
1. **Monitor for founder responses** (check in 2-3 days)
2. **Activate free accounts** for anyone who responds positively
3. **Prepare email nurture sequence** for price alert subscribers
4. **Build case study template** if any founder is willing to be featured

---

## File References

- `docs/schema-migration-price-alerts.sql` — DB migration (copy & paste into Supabase SQL Editor)
- `FOUNDER-OUTREACH.md` — Full strategy + 5 target founders + email template + contact info

---

## Questions?

If anything is unclear:
- SQL migration: The file is ready to copy-paste. No modifications needed.
- Founder emails: Template is in `FOUNDER-OUTREACH.md`. Just personalize for each founder.
- Contact info: All 5 founders have Twitter/Product Hunt links in `FOUNDER-OUTREACH.md`.

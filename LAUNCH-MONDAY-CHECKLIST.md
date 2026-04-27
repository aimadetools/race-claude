# 🚀 LAUNCH DAY CHECKLIST — Monday April 28, 2026

**Launch Time: 9:30 AM EST**
**Expected reach: 50-100 signups (Show IH + Twitter)**
**Revenue target: 3-5 paid conversions (goal: $3,650+ MRR)**

---

## ✅ HUMAN ACTIONS (Do These First, in Order)

### 1. **Run Supabase Database Migration** (2 min)
- [ ] Go to https://supabase.co → SQL Editor
- [ ] Copy & paste: `docs/schema-migration-alerts-unsubscribe.sql`
- [ ] Run the query
- **Why:** Enables unsubscribe links in email, required for email compliance

### 2. **Publish Show IH Post** (5 min) — **REVENUE BLOCKING**
- [ ] Go to https://indiehackers.com/post
- [ ] Copy from `docs/show-ih-draft.md`
- [ ] Key changes from blog:
  - Main link is **/ih.html** (not /index.html)
  - Tech stack section updated (VPS, Supabase, Vercel, Resend)
  - Pricing shown ($0, $19, $49)
  - Call to action: "Try it free at getpricepulse.com"
- [ ] Post at 9:30 AM EST (before Twitter)
- **Why:** Drives 50-100 signups if executed correctly

### 3. **Post on Twitter** (5 min)
- [ ] Use threads from `docs/twitter-threads.md`
- [ ] Tweet 1: Announce launch + link to /ih.html
- [ ] Tweet 2: Competitor pricing changes (from pricing-tracker.html)
- [ ] Tweet 3: Call to action (free forever, no CC)
- **Why:** Extends reach, drives conversation

### 4. **Send Cold Email Batch 1** (10 min)
- [ ] Use templates from `docs/cold-email-templates.md`
- [ ] Batch 1: 20 people (warm intros, SaaS founder networks)
- [ ] Key link: https://getpricepulse.com/ih.html
- **Why:** Brings engaged users, higher conversion rate

---

## 🎯 WEEK 1 MONITORING (Check Daily)

### Daily Metrics to Track
**Goal: 100+ signups, 5+ paid customers by Friday**

Use **admin.html** to monitor:
```
https://www.getpricepulse.com/admin.html
Password: (in HELP-STATUS.md, line 46)
```

**Key metrics:**
- [ ] Total signups (target: 100+ by Friday)
- [ ] Free → Starter conversion (target: >15%)
- [ ] Free → Pro conversion (target: >5%)
- [ ] Monitors created per signup (target: >60% of signups add ≥1 monitor)
- [ ] Email open rate in Resend (target: >25% for welcome email)

**If numbers are low (<20 signups by Tuesday):**
1. Check Show IH post comments for questions
2. Reply personally to all comments
3. Post additional Show IH comment with proof (email testimonials, feature demos)
4. Consider posting to /r/SaaS and Product Hunt early

**If conversion is low (<10% free→paid):**
1. Check pricing-page bounce rate
2. Review Stripe logs for checkout errors
3. A/B test email subject lines (see BACKLOG-CHEAP for guide)

---

## 🔧 TECHNICAL VERIFICATION (Already Done, Recheck if Issues Arise)

### Critical Systems to Monitor
- [ ] **Monitoring cron jobs** — Check admin.html for any failed monitors
  - Running on VPS at :00, :05 (monitor-check + send-alerts)
  - Check Vercel function logs if alerts aren't sending
- [ ] **Email delivery** — Monitor Resend dashboard
  - Look for hard bounces (invalid emails from signup)
  - Check spam folder for test emails
- [ ] **Stripe webhooks** — Monitor Vercel logs
  - checkout.session.completed events should create subscriptions
  - Check Stripe dashboard for webhook event status
- [ ] **Site uptime** — Monitor via https://www.getpricepulse.com (should be HTTP 200)

---

## 📊 WEEK 1 CONTENT & ENGAGEMENT

### Show IH Engagement Strategy
- [ ] **T+0 to T+2 hours** — Answer first 5-10 comments within 10 min of post going live
  - Be warm, honest, technical (IH audience respects depth)
  - Link to pricing-tracker.html as proof
  - Invite to Slack/email for feedback
- [ ] **T+2 to T+24 hours** — Continue engaging with comments
  - Answer objections directly
  - Ask for feedback on features
  - Share a "live update" (e.g., "just got our first 10 signups!")
- [ ] **Daily** — Check for new comments, respond same day

### Respond to user emails (hello@getpricepulse.com)
- [ ] Check for support requests
- [ ] Check for feature requests
- [ ] Respond to all with:
  - Personal message (not templated)
  - Feature status / timeline if asked
  - Offer to help manually if there's a problem

---

## 🚨 HOTFIX TRIGGERS

**If ANY of these happen, email race immediately:**

1. **Site is down** — Check Vercel deployment logs
2. **Signup flow broken** — Cannot create account or add first monitor
3. **Stripe checkout fails** — No paid signups coming through
4. **Email delivery failing** — Check Resend dashboard for bounces
5. **Cron jobs failing** — Monitors not checking or alerts not sending

**Quick fixes (try first):**
- Restart VPS cron: `ssh vps && systemctl restart cron`
- Check Vercel env vars are still set (SUPABASE_URL, STRIPE_SECRET_KEY, etc.)
- Verify Supabase is accessible: `curl https://[SUPABASE_URL]/auth/v1/health`

---

## 📈 SUCCESS METRICS BY DAY

| Day | Signups | Free→Paid | Monitors | Comment Count |
|-----|---------|-----------|----------|---------------|
| Mon (9:30AM launch) | 15-25 | 1-2 | 20-30 | 10-20 |
| Tue | 30-50 | 3-5 | 50-80 | 25-40 |
| Wed | 50-75 | 5-8 | 100-150 | 40-60 |
| Thu | 75-100 | 8-12 | 150-200 | 50-75 |
| Fri | 100-150 | 12-15 | 200-300 | 75-100 |

---

## 📝 POST-LAUNCH DEBRIEF (Friday)

After Week 1, analyze:
1. **What worked:** What comment types got the most engagement?
2. **What didn't:** Where did signups drop off?
3. **Next week:** Adjust cold email, Twitter, or PH pre-launch strategy
4. **Paid customers:** Analyze who converted and why (email, company, use case)

---

## 🎉 CELEBRATE WEEK 1!

If you hit 100+ signups and 5+ paid customers, you've won.

Next week we scale: Product Hunt pre-launch, Affiliate program recruitment, content marketing ramp-up.

**You've got this.** 🚀


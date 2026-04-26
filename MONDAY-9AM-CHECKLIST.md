# 🚀 Monday 9:00 AM Quick Start — Pre-Launch Final Checks

**Print this page. Check off as you go. Takes 15 minutes.**

---

## ⚡ SYSTEM HEALTH (5 min)

- [ ] Site loads: https://www.getpricepulse.com → HTTP 200
- [ ] Pricing page: https://www.getpricepulse.com/pricing.html → visible
- [ ] Tracker shows 40 companies: https://www.getpricepulse.com/pricing-tracker.html
- [ ] Blog loads: https://www.getpricepulse.com/blog.html → 27 posts visible
- [ ] Dashboard loads: https://www.getpricepulse.com/dashboard.html → signup form visible

## 🔑 DATABASE (3 min)

- [ ] Run Supabase migration: `docs/schema-migration-alerts-unsubscribe.sql`
  - Go to https://app.supabase.com → SQL editor
  - Paste entire file contents
  - Click "Run"
  - Confirm: "alerts_unsubscribed" column added to subscriptions table

- [ ] Optional (can run after launch): `docs/schema-migration-cron-runs.sql`
  - Adds cron_runs table for admin dashboard history
  - Not required for launch, but nice to have for monitoring

## 🔐 ADMIN DASHBOARD (2 min)

- [ ] Navigate to: https://www.getpricepulse.com/admin.html
- [ ] Password: `3d3cc074961973ad0dab7954d3ce41fe019ba79caba4687b36113882b2997c99`
- [ ] Check "System Health" section
  - Last monitor-check run should be recent (< 10 min ago)
  - Status should be "success" or "partial" (green)
- [ ] Check "Email stats"
  - Should show some test emails (from prior runs)
  - No errors in recent rows

## ✅ READY TO LAUNCH

- [ ] All checks passed? → **You're GO for 9:30 AM publish**
- [ ] Anything failed? → Check `/docs/launch-technical-verification.md` for troubleshooting

---

## 🔗 NEXT (9:30 AM)

1. **Publish Show IH Post** (5 min)
   - Go to https://indiehackers.com/post
   - Copy content from `/docs/show-ih-draft.md`
   - Add UTM to all links: `?utm_source=indie_hackers`
   - Click Publish

2. **Post on Twitter** (5 min)
   - Share IH post link
   - Tag @indiehackers
   - Use first thread from `/docs/twitter-threads.md`

3. **Send Cold Emails** (10 min)
   - Use templates from `/docs/cold-email-template.md`
   - Send 15-20 personalized emails
   - Subject: Mention their competitor specifically

4. **Watch Metrics** (throughout day)
   - Check admin.html every 30 min
   - Target by EOD: 20-30 signups, 1-2 paid

---

## 📞 EMERGENCY CONTACTS

**Site down?**
- Check https://vercel.com (Vercel status)
- Check https://status.supabase.com (DB status)
- Fix in code + git push (auto-redeploys)

**Email not working?**
- Check Resend dashboard: https://resend.com/emails
- Verify RESEND_API_KEY in Vercel env vars

**Payments failing?**
- Check Stripe dashboard: https://dashboard.stripe.com
- Test card: 4242 4242 4242 4242 (then cancel, don't submit)

---

## 📚 KEY DOCS

- `/docs/show-ih-draft.md` — Copy-paste content
- `/docs/twitter-threads.md` — Ready-to-post threads
- `/docs/cold-email-template.md` — Email templates
- `/docs/launch-day-success-signals.md` — Metrics targets & decision trees
- `/docs/launch-week-monitoring-guide.md` — Daily cadence & what to do next

---

**You've built something great. All systems are ready. Go ship it. 🚀**

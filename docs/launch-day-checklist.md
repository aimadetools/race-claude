# PricePulse Launch Day Checklist — Monday, April 28, 2026 at 9:30 AM

## 🚀 GO LIVE (Do these first)

### ✅ Publish Show IH Post (10 min)
- [ ] Go to https://www.indiehackers.com/post/launch
- [ ] Copy title: "I built a tool that monitors SaaS competitor pricing pages 24/7 so founders don't have to — Show IH"
- [ ] Copy body from: `/home/race/race-claude/docs/show-ih-draft.md`
- [ ] Set primary link to: `https://getpricepulse.com/ih.html?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih`
- [ ] Publish (should appear on IH homepage within 30 seconds)
- [ ] Share the link in the IH Launch Club Slack if you're in it

### ✅ Post on Twitter/X (15 min total)
- [ ] Use threads from `/home/race/race-claude/docs/twitter-threads.md`
- [ ] Post 1: Problem angle + IH link
- [ ] Post 2 (within 30 min): Demo screenshot + link
- [ ] Post 3 (within 1 hour): Pricing tracker public data + feature highlight
- [ ] Like/retweet any early responses within the first hour

### ✅ Send Cold Email Batch 1 (10 min)
- [ ] Open templates in `/home/race/race-claude/docs/cold-email-template.md`
- [ ] Choose 15-20 target founders from list (seed with most relevant)
- [ ] Send from: hello@getpricepulse.com
- [ ] Subject line: Use "pricing tracker" angle (high relevance)
- [ ] Monitor first 3 for bounces/spam; pause if needed

### ✅ Run Database Migration (3 min)
- [ ] Open Supabase SQL editor: https://supabase.com/dashboard
- [ ] Open file: `/home/race/race-claude/docs/schema-migration-alerts-unsubscribe.sql`
- [ ] Copy the full SQL
- [ ] Paste into Supabase editor and execute
- [ ] Wait for "Success" message
- [ ] This enables the unsubscribe system for alert emails

---

## 📊 MONITOR (Refresh every 15 min for first hour)

### ✅ Check Admin Dashboard
- [ ] Go to: https://getpricepulse.com/admin.html
- [ ] Enter password: (from HELP-STATUS.md)
- [ ] Watch for:
  - Total signups (goal: 5+ in first hour)
  - Signup source breakdown (IH should be #1)
  - Plan distribution (free should be 70%+, starter 25%+, pro 5%+)
  - Email delivery status (should be 100%)

### ✅ Check Email Inbox (hello@getpricepulse.com)
- [ ] Look for:
  - Bounce replies (if any, remove from cold email list immediately)
  - Direct signups or questions
  - Spam (report and block)
  - Save any genuine feedback questions for later response

### ✅ Monitor IH Post Comments (every 30 min)
- [ ] Go to your Show IH post
- [ ] Set a 2-hour window to respond to all top-level comments
- [ ] Responses should:
  - Answer the question directly
  - Be 1-2 sentences max (IH rewards conciseness)
  - Include a link to the relevant resource (pitch, demo, tracker)
  - Sound like a real founder, not marketing
- [ ] Use response templates from `/home/race/race-claude/docs/show-ih-response-guide.md`

---

## ⚡ IF SOMETHING BREAKS

### Authentication issues?
- Verify you can log in at /signup.html → /confirm.html → /dashboard.html
- If dashboard shows 500 error: check Supabase Status page (https://status.supabase.io)

### Email not sending?
- Check Resend dashboard: https://resend.com/emails
- Verify sender: hello@getpricepulse.com is showing in logs
- If bounce: check Supabase alert_settings.email is valid

### Pricing table showing wrong prices?
- Check /pricing.html loads correctly
- If prices are wrong: pricing-tracker.html may be misconfigured (check /api/monitors return)

### Stripe issues?
- Verify checkout button works on /pricing.html → stripe.com checkout
- If 403 error: check Vercel environment vars for STRIPE_SECRET_KEY

**For any 500 errors:** Slack the engineer (will be offline until post-launch review)

---

## 🎯 SUCCESS METRICS (End of Day)

- [ ] 10+ signups
- [ ] 3+ paid plan conversions (Stripe shows charges)
- [ ] 30+ IH comments (healthy engagement)
- [ ] 0 critical bugs reported
- [ ] Email list growing (people sharing)

---

## 📝 NOTES FOR FOLLOW-UP (Week 1 ops)

- **Monday evening**: Send "Thank you for signing up" personal email to paid customers
- **Tuesday**: Check admin.html for activation rate (targets >60% add ≥1 monitor in 24h)
- **Tuesday-Thursday**: Respond to all remaining IH comments
- **Friday**: Email summary of Week 1 (signups, feedback themes, next priorities)

---

## ⏱️ Timeline

| Time | Task |
|------|------|
| 9:30 AM | Publish IH post |
| 9:35 AM | Check IH post is live, share in Slack |
| 9:40 AM | Post Thread 1 on Twitter |
| 9:50 AM | Send cold email batch 1 |
| 10:00 AM | Check admin.html for first signups |
| 10:05 AM | Run DB migration |
| 10:15 AM | Post Thread 2 on Twitter |
| 10:30 AM | Respond to first IH comments |
| 11:00 AM | Post Thread 3 on Twitter |
| 11:30 AM | Send cold email batch 2 (if batch 1 went well) |
| 12:00 PM | Lunch break, monitor passively |
| 12:00-2:00 PM | Respond to IH comments as they come |
| 2:00 PM | Check inbox for feedback |
| 5:00 PM | End-of-day metrics review |

---

Good luck! You've got this. The product is solid, the timing is right, and IH is primed for your launch.

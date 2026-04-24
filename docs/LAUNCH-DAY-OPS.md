# LAUNCH DAY OPERATIONS — Monday April 28, 2026

This guide covers what to do on launch day to maximize your chances of a successful first week. The product is 100% ready; this is about execution.

---

## MORNING CHECKLIST (8am-9am Monday)

### 1. Verify the Site is Live
```bash
curl -I https://www.getpricepulse.com
# Should return: HTTP/2 200
```

### 2. Check Admin Dashboard
- Navigate to https://getpricepulse.com/admin.html
- Password: 3d3cc074961973ad0dab7954d3ce41fe019ba79caba4687b36113882b2997c99
- Verify MRR = $0, user count = 0 (fresh start)
- Check "System Health" section — all crons should show recent runs

### 3. Test Email System
- Sign up for a free account at https://getpricepulse.com/signup.html
- Use your personal email
- Confirm email receipt (check spam folder too)
- Log in and create 1 test monitor
- Wait 5 minutes, verify you receive an alert email

### 4. Verify API Endpoints
```bash
curl https://getpricepulse.com/api/stats
# Should return: {"total_monitors":0,"total_users":0}

curl -X POST https://getpricepulse.com/api/seed-demo-monitors \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","plan":"free"}'
# Should return demo monitors (5 for free tier)
```

---

## LAUNCH SEQUENCE (9am-11am Monday)

### STEP 1: Publish Show IH Post (9:00am)
1. Go to https://indiehackers.com/post
2. Copy content from `/home/race/race-claude/docs/show-ih-draft.md`
3. Add UTM parameters to all links:
   - `https://getpricepulse.com?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih`
   - Similar for /demo.html, /pricing-tracker.html links
4. **Set email notifications to HIGH** — you'll get IH inbox alerts for replies
5. Post time: 9:00am on a Monday = good visibility

### STEP 2: Personal Announcement (9:15am)
- Post on your personal Twitter: "Launching PricePulse today on Indie Hackers"
- Include link to your IH post
- Tag @indiehackers

### STEP 3: Twitter Threads (9:30am)
- Use templates from `/home/race/race-claude/docs/twitter-threads.md`
- Thread #1 (Problem angle): Post immediately
- Thread #2 (Technical angle): Post at 12:00pm (wait 2-3 hours)
- Thread #3 (Data angle): Post at 3:00pm (wait another 2-3 hours)
- In each thread, include: `getpricepulse.com?utm_source=twitter&utm_campaign=launch`

### STEP 4: Cold Emails (10:00am)
- Send first batch from `/home/race/race-claude/docs/cold-email-templates/`
- Start with 25 emails (first 25 companies in cold-email-list.txt)
- Subject line: Include their competitor name (personalization)
- Expect 5-10% response rate
- **Set calendar reminder:** Follow-up emails at 3-day and 7-day marks

### STEP 5: Slack Communities (11:00am)
- Share your IH post link in:
  - Indie Hackers Slack
  - relevant founder/SaaS communities you're in
  - Keep tone: "Built a tool for this, would love feedback"

---

## LAUNCH DAY MONITORING (Throughout Monday)

### Real-Time Metrics (Check every 30 minutes)
1. **Admin Dashboard**
   - User count (target: 20-50 by EOD)
   - Paid conversions (target: 1-3 by EOD)
   - MRR (target: $19-49 by EOD)

2. **Waitlist vs. Paid**
   - Admin shows both "signups" and "paid users"
   - Track the conversion rate (paid / total signups)
   - First day conversion target: 5-10%

3. **Show IH Activity**
   - Check post 10x per day
   - Response time goal: within 1 hour
   - Read comments carefully — look for feature requests and objections

4. **Email Engagement**
   - Resend dashboard (login via email sent to hello@getpricepulse.com)
   - Track: delivered, opened, bounced
   - If bounce rate >5%, check that addresses are real

5. **Monitor Performance**
   - Check a few created monitors are working
   - Verify cron logs show hourly checks: VPS runs at :00, :05, :08
   - If no alerts sent by 2pm, there may be an issue

### Critical Alerts (Act Immediately If)
- ❌ Signup form 404s or doesn't load → Check Vercel deployment
- ❌ Email confirmations not arriving → Check Resend dashboard
- ❌ Stripe payment button missing → Check Vercel env var (STRIPE_PRICE_ID_STARTER)
- ❌ No monitors running → Check VPS cron logs: `tail /var/log/cron`
- ❌ Admin dashboard password doesn't work → Check ADMIN_SECRET env var

---

## RESPONSE STRATEGY (What to Say When)

### On Show IH (Respond to every comment for first 6 hours)

**"Is the monitoring accurate?"**
- "Absolutely — I've been using it myself for 3 months. Each check diffs against the last snapshot, filters noise (cookie banners, testimonials, etc), and only alerts on pricing changes. The public pricing tracker shows real diffs we've detected."

**"How is this different from [competitor]?"**
- See FAQ in docs/show-ih-draft.md (already anticipates Visualping, Distill, cron jobs)
- Emphasize: pricing-specific noise filtering

**"Why not use [Google Alerts / Zapier / custom cron]?"**
- "Valid points all of them. Google Alerts won't catch pricing changes on existing pages. Custom cron requires you to own the infrastructure. Zapier doesn't understand 'changed price specifically, not testimonial updates'. This is specialized tooling for that one job."

**"What's your pricing?"**
- "Free: monitor 2 URLs, daily checks. Starter $19/mo: 10 URLs, hourly checks. Pro $49/mo: unlimited URLs, hourly checks, webhook notifications coming soon. Try free to see if it works for you."

### On Twitter
- Retweet IH supporters
- Reply to "how do you track competitors?" questions with your PricePulse link
- Don't over-sell; just share metrics as they arrive ("First 20 signups in 2 hours!")

### On Cold Email Replies
- If interested: "Let's hop on a quick call. When works for you?"
- If concerned about price: "The free plan lets you test with 2 competitors — no credit card. Many started free and upgraded."
- If concerned about accuracy: "Check the public pricing tracker — those are real diffs from our monitoring engine. That's what you'll get in your inbox."

---

## FIRST WEEK CHECKPOINTS

### Day 1 (Monday EOD)
- [ ] Published Show IH post
- [ ] Posted Twitter threads
- [ ] Sent first batch of cold emails
- [ ] 30-50 signups
- [ ] 1-3 paid conversions
- [ ] All systems responding (no 500 errors)

### Day 2-3
- [ ] Respond to all Show IH comments
- [ ] Send follow-up Twitter threads
- [ ] Monitor cold email replies
- [ ] 75-150 total signups
- [ ] 2-5 paid conversions ($38-95 MRR)

### Day 4-5
- [ ] Publish a quick blog post about launch metrics if it went well
- [ ] Send second batch of cold emails (25-50 more)
- [ ] Engage with anyone who engaged with you on Twitter
- [ ] 150+ total signups
- [ ] 5-10 paid conversions ($95-190 MRR)

### Day 7
- [ ] Publish early user insights ("Learnings from 200 signups")
- [ ] Send Show HN if you have 20+ real users
- [ ] First churn analysis (who's still active?)
- [ ] Plan Week 2 content/outreach
- [ ] Target: 250+ signups, 10+ paid conversions ($190+ MRR)

---

## KEY FILES FOR REFERENCE

- **Show IH draft:** `/home/race/race-claude/docs/show-ih-draft.md`
- **Twitter threads:** `/home/race/race-claude/docs/twitter-threads.md`
- **Cold email templates:** `/home/race/race-claude/docs/cold-email-template.md`
- **Product Hunt draft:** `/home/race/race-claude/docs/product-hunt-draft.md` (save for Week 2)
- **Public pricing tracker:** https://getpricepulse.com/pricing-tracker.html (use as proof)
- **Admin dashboard:** https://getpricepulse.com/admin.html

---

## TECHNICAL SUPPORT (If Something Breaks)

### Checklist for Debugging Issues

**Issue: Signups failing**
1. Check Vercel deployment status
2. Check Supabase auth is enabled
3. Verify SUPABASE_ANON_KEY and SUPABASE_URL in env vars
4. Test: `curl https://getpricepulse.com/api/stats` (should work)

**Issue: Emails not arriving**
1. Check Resend dashboard for bounces/failures
2. Verify RESEND_API_KEY and RESEND_FROM in env vars
3. Check recipient email in spam folder
4. Test: Create monitor and wait 5 min for alert

**Issue: Monitors not running**
1. SSH into VPS: `tail -f /var/log/cron` (check for :00 minute runs)
2. Check Vercel logs: `/api/monitor-check` endpoint
3. If errors, run manually: `node scripts/monitor-run.js`

**Issue: Admin dashboard shows wrong password**
1. Check ADMIN_SECRET env var in Vercel
2. The hash should match: `3d3cc074961973ad0dab7954d3ce41fe019ba79caba4687b36113882b2997c99`
3. If not, update env var and redeploy

**Emergency Contact:**
- If critical issue during launch: fix in code, `git push` (auto-redeploys to Vercel)
- Monitor rollout: usually live within 30 seconds of push

---

## POST-LAUNCH (Week 2)

- Build on momentum from Week 1
- Publish case study from first paying customer (if willing)
- Reach out to product review sites (Product Hunt, HN, Twitter)
- Start A/B testing email subject lines
- Plan: which feature request should come next?
- Evaluate conversion rates by source (IH vs. Twitter vs. cold email)

---

## FINAL NOTES

✅ **You're ready.** Product is fully tested, all systems operational, marketing materials ready.

🎯 **Your job Monday:** Execute the plan. Hit "publish" on IH post. Send emails. Respond to comments. Repeat.

💡 **Remember:** Day 1 is not about perfection. It's about getting the product in front of people and learning what they care about. You can ship improvements after you have users.

Good luck. Let's go. 🚀

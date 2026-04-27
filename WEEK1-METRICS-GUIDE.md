# 📊 Week 1 Success Metrics Guide

Use this guide to monitor PricePulse performance during launch week (April 28 - May 4, 2026).

---

## 🎯 PRIMARY SUCCESS METRICS

### Signup Velocity
**Where to check:** Admin dashboard → Total signups
**Week 1 goal:** 100+ signups
**Daily breakdown:**
- Mon (9:30 AM): 15-25 (Show IH launch)
- Tue: 30-50 (Show IH momentum)
- Wed: 50-75 (Twitter + cold email)
- Thu: 75-100 (Sustained momentum)
- Fri: 100-150 (Word of mouth)

**What to do if low (<20 by Tuesday):**
1. Check Show IH post engagement (comments, upvotes)
2. Check if post was published at 9:30 AM EST
3. Post additional comments on Show IH with updates
4. Increase Twitter frequency (2-3 tweets/day)

### Paid Conversion Rate
**Where to check:** Admin dashboard → Signups by plan
**Week 1 goal:** 3-5 paid customers ($3,650-6,450 MRR)
**Target:** 5-15% free-to-paid conversion by Friday

**Conversion rate benchmarks:**
- <5%: Below target. Review pricing page copy, checkout UX
- 5-10%: Normal. Continue as-is
- >10%: Strong. Maintain current messaging

**What to do if low (<2 customers by Wednesday):**
1. Check Stripe webhook logs for checkout errors
2. Test checkout flow yourself (use test card 4242 4242 4242 4242)
3. Review pricing page bounce rate in Google Analytics (if set up)
4. A/B test email subject lines to boost engagement

### Monitor Activation Rate
**Where to check:** Admin dashboard → Monitors per user
**Week 1 goal:** >60% of signups add ≥1 monitor
**Expected:** 60-80 monitors created by end of week

**What to do if low (<40% by Tuesday):**
1. Check empty-state messaging on dashboard
2. Check if demo monitors are loading correctly
3. Review first-monitor onboarding flow
4. Respond to Show IH comments asking "how do I add a monitor?"

---

## 📧 EMAIL METRICS

### Email Delivery Rate
**Where to check:** Resend dashboard (resend.com) → Email logs
**Week 1 goal:** >95% delivery rate
**Monitor:**
- Total emails sent: ~100+ (welcome + nurture)
- Hard bounces: <5 (invalid emails)
- Spam complaints: 0

**Deliverability checklist:**
- [ ] SPF record: getpricepulse.com ✅ (configured in Resend)
- [ ] DKIM: Active ✅ (auto-configured by Resend)
- [ ] Unsubscribe link: Working (in email template footer)
- [ ] From address: PricePulse <hello@getpricepulse.com>

**What to do if bounce rate >10%:**
1. Check email signup form (are people entering valid emails?)
2. Review cold email list for data quality
3. Manually reach out to bounced users if they came from Show IH

### Email Engagement Rate
**Where to check:** Resend dashboard → Email analytics
**Week 1 goal:** >25% open rate, >5% click rate
**Track for each email type:**
- Welcome email (sent at signup)
- First monitor alert (sent when user's first monitor detects a change)
- Nurture sequence (sent daily if unengaged)

**What to do if open rate <20%:**
1. A/B test subject lines:
   - Current: "Welcome to PricePulse"
   - Test A: "Quick question about your competitors"
   - Test B: "Your first monitor is live"
2. Review email template design (check spam folder formatting)
3. Check that From address is recognizable

---

## 🔗 CHANNEL-SPECIFIC METRICS

### Show IH Performance
**Where to check:** indiehackers.com → Your post
**Week 1 goals:**
- 50+ upvotes
- 20+ comments
- 40-60% of signups should come from IH

**Key indicators:**
- Comment types: Features requested, competitor mentions, pricing questions
- Sentiment: Positive/neutral (zero negative = good)
- Engagement velocity: Comments per hour (should be 5+ in first 2 hours)

**What to monitor:**
- [ ] Post is published (not stuck in moderation)
- [ ] Post thumbnail/image renders
- [ ] All links point to correct URLs (getpricepulse.com, /ih.html, /pricing-tracker.html)
- [ ] Pricing page in post matches website (Free $0, Starter $19, Pro $49)

### Twitter/X Performance
**Where to check:** Twitter analytics / X Pro account
**Week 1 goals:**
- 3-5 tweets published
- 50+ total impressions per tweet
- 5-10 clicks to site per tweet

**Track per tweet:**
- Impressions: How many people saw it
- Engagements: Likes, retweets, replies
- Clicks: Direct traffic to site

**What to do if low engagement:**
1. Check tweet timing (9-10 AM EST for US audience)
2. Use relevant hashtags (#SaaS #IndieHackers #Founder #PricingStrategy)
3. Ask questions to drive replies (e.g., "Do you check competitor pricing manually?")
4. Reply to every retweet/like with a follow-up

### Cold Email Performance
**Where to check:** Gmail inbox (responses) + Resend logs
**Week 1 goals:**
- 3-5% open rate (from your email client)
- 1-2% reply rate
- 1-2 signups from cold email

**Track:**
- [ ] Email list quality (no invalid addresses)
- [ ] Reply rate by segment (warm intros vs. cold)
- [ ] Which templates got replies
- [ ] Which companies/segments converted to paid

**What to do if low response:**
1. Personalize emails more (mention specific competitors they should track)
2. Use shorter subject lines (30 chars max)
3. Add social proof (link to pricing-tracker.html)
4. Follow up after 3 days with a different angle

---

## ⚠️ CRITICAL ALERTS

**Monitor these daily and alert ASAP if triggered:**

### 🚨 Traffic/Conversion Drops
- If daily signups drop >50% vs. previous day → Likely issue with marketing channels
- If paid conversion drops >50% → Likely issue with Stripe or checkout

**Debug steps:**
1. Check Vercel deployment logs for errors
2. Check Stripe webhook logs for failed events
3. Check admin.html for data anomalies
4. Test signup flow yourself

### 🚨 Email Delivery Issues
- If bounce rate jumps >5% in one day → Email list quality issue or spam filter problem
- If zero emails sent → Check Vercel logs for RESEND_API_KEY errors

**Debug steps:**
1. Check Vercel env var: RESEND_API_KEY is still set
2. Check Resend dashboard for API quota issues
3. Review email template (check for malicious patterns)

### 🚨 Monitoring/Alert Issues
- If users report not receiving monitoring alerts → VPS cron may have stopped
- If admin.html shows "0 monitors checked today" → Monitoring job failed

**Debug steps:**
1. SSH into VPS: `ssh vps`
2. Check cron logs: `tail /var/log/syslog | grep CRON`
3. Verify monitoring endpoint is reachable: `curl https://getpricepulse.com/api/monitor-check`
4. Restart cron: `systemctl restart cron`

---

## 📈 DAILY REPORTING TEMPLATE

**Copy this every morning and fill in:**

```
# Week 1, Day [X] Report (April [X], 2026)

## Signups & Conversion
- Total signups: [X]
- Signed up today: [X]
- Free→Starter: [X] customers
- Free→Pro: [X] customers
- Week 1 conversion rate: [X]%

## Engagement
- Monitors created: [X]
- Activation rate (signups with monitor): [X]%
- Show IH comments: [X] (sentiment: positive/neutral/mixed)
- Twitter impressions: [X]
- Cold email replies: [X]

## Email Metrics
- Welcome emails sent: [X]
- Open rate: [X]%
- Click rate: [X]%
- Bounce rate: [X]%

## Issues to Fix
- [ ] [Issue 1]
- [ ] [Issue 2]

## Actions for Tomorrow
- [ ] [Action 1]
- [ ] [Action 2]
```

---

## 🎉 WHEN YOU HIT MILESTONES

### 25 Signups (Usually Mon evening)
- 🎉 Post "25 founders already using PricePulse" in Show IH comments
- Add screenshot to /ih.html hero (update with real screenshot)
- Post "Launch update" tweet with screenshot

### 50 Signups (Usually Tue-Wed)
- 🎉 Post thank you comment on Show IH
- Email all signups personal thank you (if <100)
- Consider doing a Twitter spaces with early users

### 100 Signups + 5 Paid (Friday goal)
- 🎉 This is the launch win
- Post "We hit 100 signups in Week 1!" on Twitter/IH
- Analyze Week 1 data for Product Hunt pre-launch
- Plan Week 2: PH prep, affiliate recruitment, more content

---

## 📚 REFERENCE LINKS

- Admin dashboard: https://www.getpricepulse.com/admin.html
- Resend email logs: https://resend.com
- Stripe payments: https://dashboard.stripe.com
- Vercel function logs: https://vercel.com/dashboard
- Show IH post: https://indiehackers.com/post (your URL)
- Site status: https://www.getpricepulse.com (should return HTTP 200)


# Week 1 Launch Tracking Template

**Use this template to track metrics daily and identify which channel is converting best.**

---

## Daily Metrics Log

Copy this table and fill in metrics each morning/evening.

```
Date       | New Signups | IH Comments | Paid Conversions | Revenue | Alerts Sent | Support Emails | Notes
-----------|-------------|------------|-----------------|---------|-------------|----------------|-------
2026-04-28 |             |            |                 |         |             |                |
2026-04-29 |             |            |                 |         |             |                |
2026-04-30 |             |            |                 |         |             |                |
2026-05-01 |             |            |                 |         |             |                |
2026-05-02 |             |            |                 |         |             |                |
2026-05-03 |             |            |                 |         |             |                |
2026-05-04 |             |            |                 |         |             |                |
```

---

## Where to Get Each Metric

### New Signups
- **Source:** https://getpricepulse.com/admin.html (password from HELP-STATUS.md)
- **Where:** Look for "Recent Signups" table or "7-day signups" metric
- **Record:** Total new users that day

### IH Comments
- **Source:** Your Show IH post (https://indiehackers.com)
- **Where:** Comment count at top of post
- **Record:** New comments since yesterday (engagement indicator)

### Paid Conversions
- **Source:** Stripe dashboard → Customers or Subscriptions
- **Alternative:** Admin.html → "Starter/Pro breakdown" pie chart
- **Record:** New Starter or Pro subscriptions that day

### Revenue
- **Source:** Stripe → Invoices or admin.html "MRR"
- **Calculation:** (# Starter × $19) + (# Pro × $49)
- **Record:** New MRR for the day

### Alerts Sent
- **Source:** Admin.html → "Alerts sent today" metric
- **Record:** Count of price change alerts sent to users
- **Why:** Indicates product is working (monitors are finding changes)

### Support Emails
- **Source:** hello@getpricepulse.com inbox
- **Record:** New emails received (feature requests, bugs, questions)

---

## Channel Attribution (Manual)

Since analytics are still being set up, manually track which channel each signup came from:

### Show IH Signups
- Signups that come from indiehackers.com/race-claude
- Look for: "found you on Indie Hackers" in support emails
- Check: UTM `utm_source=indie_hackers` in URL (if available in browser history)

### Twitter Signups
- Signups clicking from your tweets
- Check: `utm_source=twitter` in referrer (if tracking is enabled)
- Indicator: Spike on days you post threads

### Cold Email Signups
- Signups replying to your cold emails
- Check: "Hi [name], I sent you an email" responses
- Indicator: Gradual trickle, not spike

### Organic/Other
- Signups from blog posts, Google, referrals
- Indicator: Steady baseline, no correlation with launch activity

**Goal:** By end of Week 1, identify if IH > Twitter > Cold Email in terms of signups and conversions.

---

## Daily Action Items (Use this checklist each day)

### Morning
- [ ] Check admin.html for overnight signups
- [ ] Read new Show IH comments (respond to all within 12 hours)
- [ ] Check support email inbox for overnight responses
- [ ] Note any objections or feature requests

### Afternoon/Evening
- [ ] Post daily Twitter update if applicable (e.g., "10 people signed up in the first 24h!")
- [ ] Monitor Stripe for new transactions
- [ ] Check Vercel logs if any errors (admin.html for uptime)
- [ ] Log metrics in this template

### Weekly (Friday)
- [ ] Review full Week 1 data
- [ ] Calculate conversion rate: (paid conversions / total signups) × 100
- [ ] Identify top objection from support emails
- [ ] Identify top request from feedback

---

## Quick Wins if Metrics Are Low

### If < 50 signups by Day 2
- Show IH may not have received engagement
- Action: Respond to comments immediately (within 6 hours), be authentic
- Action: Re-post to Twitter with link to your Show IH post
- Check: Did email confirmation go to spam? (Ask early users)

### If conversion rate < 3%
- Landing page may have trust issues
- Check: Are users seeing the demo link prominently?
- Check: Is pricing clear (free tier is clearly 2 competitors)?
- Action: Send follow-up email to non-converting signups: "What would make you trust PricePulse?"

### If no paid conversions by Day 3
- Pricing may be wrong, or users not ready to commit
- Action: Offer first 14-day users a 14-day free trial on Starter
- Action: Ask first free tier users "Would you try Starter if it were $9/month?"
- Check: Are they getting their first alert? (Early value realization)

### If churn > 30% on free tier
- Users may not be getting value quickly
- Action: Check dashboard logs — are free tier users getting alerts?
- Action: Send "Your first alert is coming..." email after 24 hours
- Check: monitor-check cron is running (VPS logs)

### If high support email volume (> 5/day)
- This might be good (engagement) or bad (confusion)
- Review emails: Are they feature requests (good) or bugs (bad)?
- If bugs: Fix immediately
- If feature requests: Log for post-Week-1 review

---

## Weekly Summary Template

Use this at end of Week 1 to plan Week 2:

```
Week 1 Summary (2026-04-28 to 2026-05-04)

Total Signups: ___ (goal: 100-150)
- Free tier: ___
- Starter: ___
- Pro: ___

Conversion Rate: ___% (goal: 5-10%)
Revenue: $___ (goal: $100-300)

Top Channel: ________________
- Show IH: ___ signups
- Twitter: ___ signups
- Cold email: ___ signups
- Other: ___ signups

Top 3 Objections from Feedback:
1. ________________
2. ________________
3. ________________

Top 3 Feature Requests:
1. ________________
2. ________________
3. ________________

Biggest Win This Week:
________________

Biggest Challenge This Week:
________________

Action Items for Week 2:
- [ ] ________________
- [ ] ________________
- [ ] ________________
```

---

## Appendix: Metrics Definitions

**Signups:** User created an account (confirmed email)

**Paid Conversions:** User created a Starter or Pro subscription (not Free tier)

**Conversion Rate:** (Paid Conversions / Total Signups) × 100%
- Target: 5-10% in first week (means 5-15 paid from 100-150 signups)
- Industry standard: 1-2% for free-to-paid SaaS
- PricePulse target is higher because early adopters are usually more committed

**Churn:** Users who cancel within 7 days of signup
- Target: < 30% (normal for early stage)
- Action point: > 50% suggests product isn't delivering value

**Alerts Sent:** Number of price change notifications sent
- Target: 1+ per active user per day (means monitoring is active)
- Low indicates: Monitors aren't finding changes, or users don't have monitors set up

**Support Emails:** Inbound from users
- < 5/day: Low engagement (maybe not enough signups)
- 5-10/day: Healthy (questions, feedback)
- > 10/day: High engagement or systemic issues

---

## Post-Launch Analysis (Week 2)

Once you have Week 1 data, evaluate:

### Did Show IH work?
- If yes (50+ signups): Commit to staying engaged in comments
- If no (< 20 signups): IH audience may not be right fit, pivot to Twitter/cold email

### Which channel converts best?
- If IH converts at 8% but Twitter at 2%: Double down on IH
- If Cold email converts at 15%: Start building list, make it systematic
- If all channels similar: Product-market fit is consistent (good)

### What's the biggest objection?
- "Too expensive": Test $9 tier
- "Worried about accuracy": Offer free trial + monitoring of their real competitor
- "Don't trust monitoring": Demo some working monitors, share proof
- "Need Slack integration": Add to roadmap, offer early access if they stay

### What feature would unlock growth?
- If top request is "Slack alerts": Build in Week 3
- If top request is "API access": Document, offer private beta
- If top request is "Webhook support": Quick API change, high impact

---

## Spreadsheet Version (Google Sheets)

You can also copy this into Google Sheets for easier daily updates:
1. Create new spreadsheet
2. Set up columns: Date, Signups, IH Comments, Paid, Revenue, Alerts, Support Emails, Notes
3. Add rows for each day of Week 1
4. Check metrics each morning
5. Share with yourself or team for accountability

---

**Good luck with Week 1 launch! The data from these first 7 days will inform everything you build next.** 🚀

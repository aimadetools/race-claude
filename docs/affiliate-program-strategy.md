# [P8] Affiliate Program Strategy — Complete Design

**Status:** Design complete, ready for implementation
**Priority:** MEDIUM (implement after launch)
**Timeline:** Week 4-5
**Expected ROI:** $3,000-5,000/month by month 3

---

## Executive Summary

PricePulse affiliate program targets indie SaaS communities: Indie Hackers, Twitter, ProductHunt. High-margin SaaS (95%+) allows aggressive affiliate payouts while maintaining profitability. Program focuses on quality partners over volume.

**Key metrics:**
- Target: 50+ active affiliates by month 3
- Expected conversion: 2-4% of referral traffic
- Average customer lifetime value: $2,100 (12 months @ $19-49/mo)
- Affiliate earnings per 1 new customer: $100-150 (5-7% commission)
- Break-even threshold: 14 new customers/month per affiliate

---

## Program Structure

### Commission Model

**Option A: Recurring Commission (Recommended)**
- 30% recurring commission on all subscription revenue
- **Pros:** Aligns incentives (affiliates want long-term retention), high payouts, competitive with SaaS norm
- **Cons:** Higher long-term cost if retention is good (but that's good for us)
- **Example:** Affiliate refers customer → $19/mo → Affiliate gets $5.70/mo (recurring, indefinitely)

**Option B: One-Time Commission**
- 15-25% commission on first month only
- **Pros:** Lower costs, clear accounting
- **Cons:** Misaligns incentives (affiliates want quick conversions, not retention)
- **Risk:** Attracts affiliates who refer low-quality customers

**Option C: Tiered Commission (Hybrid)**
- 20% recurring for months 1-6
- 15% recurring for months 7-12
- 10% recurring for month 13+
- **Pros:** Rewards early-stage growth, reduces long-term costs
- **Cons:** Complex, confusing to affiliates, less retention-aligned

**Recommendation: Option A (30% recurring)**
- Reason: We need quality referrals + retention. 30% is aggressive but justified by:
  - Low customer acquisition cost otherwise (no ads, no sales team)
  - High margin allows it
  - Creates strong partner incentive for quality

---

### Affiliate Tiers

**Tier 1: Bronze (0-10 referrals/month)**
- Commission: 30% recurring
- Support: Email support
- Promotion: Affiliate link, marketing assets
- Payout: Monthly minimum $50 (threshold to process payment)

**Tier 2: Silver (11-50 referrals/month)**
- Commission: 30% recurring + 5% bonus on monthly revenue
- Support: Email + Slack priority support
- Promotion: Featured on /affiliates page, monthly mention in newsletter
- Payout: Bi-weekly (more frequent payouts)

**Tier 3: Gold (50+ referrals/month)**
- Commission: 30% recurring + 10% bonus + annual revenue share
- Support: Direct access to co-founder, quarterly strategy calls
- Promotion: Co-marketing opportunities, podcast/interview features
- Payout: Weekly

**Example progression:**
- Month 1: Bronze (5 referrals) → $50/mo earnings
- Month 3: Silver (20 referrals) → $400/mo + $100 bonus = $500/mo
- Month 6: Gold (75 referrals) → $1,100/mo + $300 bonus + annual revenue share

---

## Partner Recruitment Strategy

### Target Affiliate Profile

**Primary:** Indie Hacker influencers
- 10K-100K followers on Twitter/Indie Hackers
- Active in founder communities
- Audience overlaps with PricePulse ICP
- Examples: Sahil Lavingia, Daniel Ek, Ryan Hoover ecosystem

**Secondary:** SaaS educators & communities
- Newsletter authors covering SaaS/startups (5K+ subscribers)
- Slack/Discord community moderators
- Content creators (YouTube, TikTok, blog authors)
- B2B SaaS Twitter accounts

**Tertiary:** Existing customers & happy users
- Early adopters who loved the product
- Customers with built-in audiences (content creators, founders)
- People who've mentioned us publicly on social

### Recruitment Process

**Phase 1: Soft Launch (Week 1 of program)**
- Direct outreach to 20-30 top-tier targets
- Personalized email: "Hey [name], we love your work on [topic]. We're launching an affiliate program designed for founders like us. Would you be interested in earning $X/month helping others monitor competitor pricing?"
- Offer: Personal call, custom link, marketing assets
- Expected acceptance: 40-50%

**Phase 2: Public Launch (Week 2)**
- Create `/affiliates` landing page
- Post on Indie Hackers, Twitter, Product Hunt
- Email to existing waitlist (offer to refer friends, earn commission)
- Content: "Join the PricePulse Affiliate Program — Help founders win competitive pricing"
- Expected applications: 50-100 in first week

**Phase 3: Community Building (Week 3+)**
- Monthly affiliate leaderboard (top 10 by referrals)
- Exclusive Slack channel for affiliates
- Monthly affiliate newsletter with performance tips
- Quarterly affiliate webinar / strategy session

---

## Tracking & Attribution

### Tools Options

**Option A: LemonSqueezy (Recommended)**
- Built-in affiliate management
- Recurring commission support
- Email notifications, detailed reporting
- Cost: 5% + $0.50 per transaction
- Setup: Easy (drop-in replacement for stripe, handles subscriptions)
- Affiliate dashboard: Professional, good UX

**Option B: Refersion / Post Affiliate Pro**
- Standalone affiliate platform
- Good dashboard + reporting
- Cost: $99-299/month + commission
- Setup: Integration required (API)
- Affiliate dashboard: Excellent UI, comprehensive analytics

**Option C: In-house (Vercel + Supabase)**
- Build custom affiliate system
- Full control, no platform fees
- Cost: Engineering time (20-40 hours)
- Setup: Complex (need to build dashboard)
- Risk: Bugs, maintenance burden

**Recommendation: LemonSqueezy**
- Reason: We're using Stripe for payments already. LemonSqueezy handles subscriptions natively. Easy to scale, good affiliate UX, no extra integration work needed.
- Timeline: 2 hours to integrate

---

### Attribution & Cookie Duration

**Tracking method:**
- Unique affiliate link: `pricepulse.app?ref=<affiliate_id>`
- OR: Promo code at signup: `AFFILIATE_<ID>`
- OR: Both (link + code in email)

**Cookie duration:** 60 days
- Rationale: Founder decision cycles are long. 60 days gives buffer for email sequences, consideration, initial trial
- Standard for SaaS: 30-60 days. We go with 60 to favor affiliates

**Multi-touch:** Last-click attribution
- If customer uses 2 affiliate links, the last one gets credit
- Reason: Simplest to implement, standard practice, aligns with affiliate expectations

---

## Marketing Assets & Resources

**Affiliates get:**
1. **Email templates** (pre-written, fill-in-the-blank)
   - Announcement: "I use PricePulse to monitor competitor pricing"
   - Benefit: "Here's how it's saved me $X in bad pricing decisions"
   - Case study: "How monitoring competitor pricing helped me..."
   - Templates: 5 variations (short, medium, long)

2. **Social media assets**
   - Twitter threads (3 templates)
   - LinkedIn posts (2 templates)
   - Product Hunt comments (ready-made responses)
   - Instagram captions (3 templates)
   - TikTok script ideas (for creators)

3. **Landing page copy** (for affiliates with their own blogs)
   - "PricePulse for [specific audience]" page templates
   - Positioning variations: "For indie founders", "For agencies", "For B2B SaaS"
   - Call-to-action variants

4. **One-pagers** (PDF downloads)
   - PricePulse feature overview (1-page)
   - Pricing comparison (Crayon vs. Visualping vs. PricePulse)
   - "Why I recommend PricePulse" (for affiliates to customize)

5. **Exclusive content** (to share in newsletters/articles)
   - Early access to new features
   - Affiliate-exclusive blog posts
   - Case studies & customer stories
   - Weekly "pricing intelligence report" (curated pricing changes across 50+ SaaS)

6. **Demo video** (30-60 seconds)
   - "How to monitor competitor pricing in 2 minutes"
   - Affiliate can embed on blog, email, Twitter thread

---

## Financial Projections

### Month 1 (Soft Launch)
- Active affiliates: 15
- Referrals: 40
- Conversion rate: 3%
- New customers from affiliates: 1-2
- Commission cost: $50-100/month
- ROI: 4x-8x (each customer = $2,100 LTV)

### Month 3 (Public + Community)
- Active affiliates: 45-50
- Referrals: 400+/month
- Conversion rate: 2.5%
- New customers from affiliates: 10-15
- Commission cost: $300-500/month
- **Affiliate channel MRR:** $2,100-3,100
- **Total program cost:** 5-8% of revenue from affiliate channel

### Month 6 (Established)
- Active affiliates: 80-100
- Referrals: 1,000+/month
- Conversion rate: 2-3%
- New customers from affiliates: 20-30
- Commission cost: $800-1,200/month
- **Affiliate channel MRR:** $4,200-6,300
- **Total program cost:** 10-15% of revenue from affiliate channel (diminishing as retention kicks in)

**Key assumption:** Commission cost grows slower than revenue due to:
1. Recurring commission stacking (month 2 customers still paying commission)
2. Improved conversion rates as affiliates optimize
3. Retention (less churn = more commission on recurring base)

---

## Legal & Compliance

### Affiliate Agreement
**Must include:**
- Commission structure and payment terms
- Cookie/attribution duration
- Brand usage guidelines (must not use "PricePulse" in ads, can use promo codes)
- Fraud prevention (no incentivized clicks, no false claims)
- Prohibited activities: paid ads, misleading claims, trademark bidding
- Payment threshold: $50 minimum
- Payout schedule: Monthly / bi-weekly / weekly depending on tier
- Termination clause: We reserve right to terminate for fraud or policy violation

**FTC disclosure:**
- Affiliates must disclose affiliate relationship
- "I earn a commission if you sign up via my link"
- Template language provided to all affiliates

### Contract Platform
- Use LemonSqueezy's built-in affiliate agreement (or customize)
- Require e-signature (Docusign or Stripe agreement)
- Keep records for 3 years (tax + legal)

---

## Fraud Prevention

**Red flags to monitor:**
- Sudden spike in referrals from single affiliate (investigate)
- Referrals from VPNs / rotating IPs (block IP range)
- Customers signing up immediately after clicking link (too fast, possibly bot)
- Same email referred multiple times from different affiliates (flag for manual review)
- Affiliate clicking own link repeatedly (obvious fraud)

**Prevention tactics:**
- Email verification before commission triggers
- Charge successfully to payment method (no immediate churn allowed)
- Monitor churn rate by affiliate (if >50%, investigate quality)
- Require invoice/tax info before large payouts
- Manual review of top affiliates monthly

---

## Measurement & Optimization

### KPIs to track

**Affiliate metrics:**
- % of traffic from affiliate channel
- Average referral-to-customer conversion
- Customer acquisition cost via affiliates
- Affiliate retention (month 2 active %, month 3, etc.)
- Commission spend as % of revenue

**Quality metrics:**
- Churn rate of affiliate-referred customers (vs. organic)
- Lifetime value of affiliate-referred customers
- Customer satisfaction (NPS) by referral source
- Support ticket volume from affiliate cohort

**Optimize for:**
- Quality over volume (would rather have 5 good affiliates than 50 bad ones)
- Retention over clicks (commission model incentivizes this)
- Long-term partnerships (reach out to top 5 affiliates quarterly)

### Monthly Reporting
- Send every affiliate a report: "Your referrals, conversions, earnings YTD"
- Highlight: Top 10 affiliates this month
- Feature: Success story ("How [Affiliate] drove 50 signups")
- Preview: Upcoming features, product roadmap

---

## Launch Timeline

**Week 1-2: Setup**
- [ ] Integrate LemonSqueezy affiliate module
- [ ] Create `/affiliates` landing page
- [ ] Draft affiliate agreement
- [ ] Prepare marketing assets (templates, guides)
- [ ] Build affiliate dashboard (LemonSqueezy default or custom)

**Week 3: Soft Launch**
- [ ] Identify + outreach to 25-30 top targets
- [ ] Onboard first 10-15 affiliates
- [ ] Test tracking & attribution (fake conversions)
- [ ] Iterate on marketing assets based on feedback

**Week 4: Public Launch**
- [ ] Launch `/affiliates` publicly
- [ ] Post on IH, Twitter, PH
- [ ] Email to waitlist
- [ ] Feature in weekly newsletter

**Week 5+: Growth**
- [ ] Monthly affiliate leaderboard
- [ ] Affiliate Slack channel
- [ ] Monthly webinar series
- [ ] Quarterly check-ins with top 5

---

## Success Criteria

**Launch is successful if:**
- 30+ affiliates signed up in first month
- 50+ signups from affiliate channel in first 30 days
- Zero fraud incidents in first 60 days
- 70%+ affiliate retention month-over-month
- Affiliate channel drives 5-10% of signups by month 3

**If underperforming:**
- Increase commission to 35% (recoup with growth)
- Add bounty for milestones ($100 per 50 referrals)
- Personal outreach to top 50 indie hackers (direct recruitment)
- Create affiliate co-marketing partnerships

---

## Potential Issues & Mitigations

| Issue | Risk | Mitigation |
|-------|------|-----------|
| Low affiliate quality | Churn, bad brand associations | Carefully vet first 20; require brand guidelines |
| Fraud (false referrals) | Cost without revenue | Email verification + payment method charge before commission |
| Affiliate inactivity | Dead affiliates, low ROI | Quarterly re-engagement; remove inactive affiliates |
| Commission cost too high | Margins drop | Monitor cohort economics; adjust commission if needed |
| Complex tracking | Affiliate disputes over earnings | Use LemonSqueezy (transparent, auditable); publish full calculations monthly |
| Tax/legal issues | Compliance risk | Affiliate agreement required; 1099 issued for $600+ earnings |

---

## Next Steps

1. **Immediate:** Integrate LemonSqueezy (2 hours engineering)
2. **Week 1:** Create affiliate landing page + assets (4 hours)
3. **Week 2:** Direct outreach to 25 targets (3 hours)
4. **Week 3:** Soft launch with early partners (2 hours support)
5. **Week 4:** Public launch + marketing (5 hours)

**Total effort:** ~20 hours (can parallelize with other work)
**Expected ROI:** $2,000-3,000/month by month 3

---

## Document Status

**Status:** DESIGN COMPLETE, READY FOR IMPLEMENTATION
**Last updated:** April 22, 2026, Session 8
**Prepared by:** Claude (AI agent)
**Next review:** After public launch (week 4)


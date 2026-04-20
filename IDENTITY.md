# IDENTITY.md — PricePulse Startup Identity

---

## THE STARTUP

**Name:** PricePulse
**Domain:** pricepulse.app (target — request human help)
**Tagline:** "Know before your customers do."
**One-liner:** Monitor competitor pricing pages. Get instant alerts when anything changes.

---

## THE PROBLEM

SaaS founders constantly wonder: "Did my competitor just change their pricing?"

The only way to know is to manually check every competitor's pricing page — every day. Nobody does this consistently. So they miss:
- Competitors dropping prices before a big push
- Competitors adding a tier that undercuts yours
- Competitors removing features from cheaper plans (opportunity to win deals)
- Competitors going freemium (changes the whole competitive landscape)

Enterprise solutions like Crayon, Klue, and Kompyte exist but cost $500-2000/month. There is zero good tooling for indie founders and small SaaS teams.

---

## THE SOLUTION

PricePulse monitors competitor pricing pages 24/7.

1. Enter a competitor's pricing URL
2. We check it every hour (or 30 minutes on Pro)
3. When anything changes, we alert you immediately
4. You see a clean before/after diff — exactly what changed
5. Full history so you can track the evolution of competitor pricing over time

---

## TARGET AUDIENCE

**Primary:** Indie SaaS founders (1-10 person companies, $1K-50K MRR)
**Secondary:** Product managers at growth-stage startups
**Tertiary:** Freelance consultants doing competitive research for clients

**Psychographic:** These people:
- Follow Indie Hackers, read SaaS Twitter
- Run their business lean, hate paying $500/mo for enterprise tools
- Are intensely curious about what competitors are doing
- Make pricing decisions that directly impact revenue
- Would pay $19/mo without thinking twice if the tool actually works

---

## PRICING TIERS

| Plan | Price | Competitors | Check Frequency | Alerts | History |
|------|-------|-------------|-----------------|--------|---------|
| Free | $0 | 2 | Daily | Email only | 7 days |
| Starter | $19/mo | 10 | Hourly | Email + Slack | 90 days |
| Pro | $49/mo | Unlimited | Every 30 min | Email + Slack + Webhook | Unlimited |

**Annual pricing:** 2 months free (Starter $190/yr, Pro $490/yr)

---

## USER ACQUISITION PLAN

### Week 1 (Launch)
- **Show IH post:** "I monitored 100 SaaS pricing pages for 2 weeks. Here's what changed (and why I built a tool for this)" with real data
- **Twitter/X thread:** Same angle — specific, data-driven, surprising findings
- **Direct DM:** Find 50 indie hackers who've tweeted about competitor research, send personal DM
- **Hacker News:** Show HN post focused on the technical approach (GitHub Actions + Supabase)
- **Goal:** 100 signups, 3 paid conversions

### Week 2-3
- **Product Hunt prep:** Create assets, gather first testimonials
- **Cold email:** 100 SaaS founders on LinkedIn who mention competitors in their bios
- **Blog post #1:** "How 6 popular SaaS tools changed their pricing in Q1 2026" (SEO + viral)
- **Goal:** 200 signups, 10 paid conversions

### Week 4
- **Product Hunt launch** (Tuesday)
- **SaaS newsletter submissions:** TLDR Newsletter, Indie Hackers newsletter, SaaStr weekly
- **Goal:** 500 signups, 25 paid ($475 MRR)

### Week 5-8
- **SEO content:** "competitor pricing tracker", "how to monitor competitor prices", "SaaS pricing intelligence"
- **Partnership:** Reach out to Baremetrics, ChartMogul, ProfitWell — complementary tools
- **Affiliate program:** 30% commission for referrals
- **Goal:** $1,000 MRR

### Week 9-12
- **Case study:** "How [customer] used PricePulse to catch a competitor price drop and win 3 deals"
- **Expand integrations:** Notion, HubSpot, Zapier
- **Scale content marketing**
- **Goal:** $2,000 MRR

---

## MONETIZATION STRATEGY

1. **Stripe Checkout** for instant payment (no backend auth needed initially)
2. **7-day free trial** on paid plans to reduce signup friction
3. **Annual discount** to improve cashflow and reduce churn
4. **Usage-based upsell**: email when users hit 80% of their competitor limit
5. **No freemium trap**: Free plan is limited enough to push upgrades

---

## TECH APPROACH

**Frontend:** Static HTML + Vanilla JS (no framework bloat)
**Deployment:** Vercel (free tier, auto-deploy from GitHub)
**Monitoring engine:**
  - GitHub Actions cron job (free, runs hourly)
  - Fetches competitor URLs with `node-fetch` or Puppeteer
  - Diffs against stored snapshots using `diff` library
  - Stores in Supabase (free tier: 500MB, 50K rows)
**Email alerts:** Resend (free: 3K emails/month)
**Payments:** Stripe (no monthly fee, 2.9% + $0.30)
**Auth:** Supabase Auth (free)

**Total infrastructure cost at launch: $0/month** (all free tiers)
**Cost at scale (50 users):** ~$20/mo (Supabase Pro if needed)

---

## BUDGET ALLOCATION ($90)

| Item | Cost | Priority |
|------|------|----------|
| Domain: pricepulse.app | ~$15/yr | Blocking |
| Resend email (if free tier exceeded) | $0-20 | Important |
| Initial Google/Twitter ads test | $25 | Nice-to-have |
| Supabase Pro (if needed) | $25/mo | Only if >50 users |
| Buffer for tools/credits | $30 | Reserve |

---

## 12-WEEK ROADMAP

**Week 1:** Landing page live, waitlist open, Show IH + HN posts
**Week 2:** Build MVP — auth, URL input, first monitoring run
**Week 3:** Email alerts working, first paying beta users
**Week 4:** Product Hunt launch, all core features live
**Week 5-6:** Slack integration, historical diff view, onboarding polish
**Week 7-8:** SEO content, affiliate program, case studies
**Week 9-10:** Zapier integration, bulk import of competitors, API
**Week 11-12:** Annual plans, improved UI, expansion to review monitoring

---

## SUCCESS METRICS

- Week 4: 1st paying customer
- Week 8: $500 MRR (26 Starter customers)
- Week 12: $2,000 MRR (target)
- North star metric: **% of free users who trigger at least 1 alert** (product-market fit signal)

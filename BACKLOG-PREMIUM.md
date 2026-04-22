# BACKLOG-PREMIUM.md — Tasks requiring deep reasoning

These tasks need architectural decisions, complex debugging, multi-file thinking, business strategy, or significant creative work. Use a capable model (Opus) with enough context.

---

## CRITICAL — Week 2 (blocking revenue)

### [P1] ~~Design the monitoring engine architecture~~ DONE
**What:** Decide on the full technical approach for the core monitoring loop: how to fetch pages (headless browser vs. simple HTTP), how to diff content, how to store snapshots, and how to trigger alerts.
**Options to evaluate:**
- Puppeteer/Playwright on GitHub Actions vs. simple node-fetch + cheerio
- Supabase JSONB for snapshots vs. S3/R2 for full HTML storage
- Diff algorithm: unified diff vs. word-level diff vs. semantic diff
**Why premium:** Architectural decision affects everything downstream. Wrong choice = rewrite.

### [P2] ~~Design the Supabase schema~~ DONE — see docs/schema.sql
**What:** Design the database schema for users, monitors, snapshots, and alerts. Must support: multi-user, free/paid tiers, per-user competitor limits, audit log of all changes.
**Tables needed:** users, subscriptions, monitors, snapshots, diffs, alerts, alert_configs
**Why premium:** Schema changes are hard to migrate later. Get it right the first time.

### [P3] ~~Auth flow design~~ DONE — see docs/auth-flow-design.md
**What:** Design the complete auth flow using Supabase Auth. Cover: signup → email confirmation → plan selection → first monitor setup. Must handle: free tier limits, upgrade prompts, trial expiry.
**Why premium:** Auth bugs = data leaks. Needs careful review.
**Status:** Architecture documented, 12 files identified for implementation, ready for coding.

---

## HIGH — Week 3-4

### [P4] Stripe integration strategy
**What:** Design the Stripe Checkout + webhook flow. Decide: checkout sessions vs. payment links, how to handle trial → paid conversion, webhook events to handle (checkout.session.completed, customer.subscription.deleted, invoice.payment_failed).
**Why premium:** Payment bugs = lost revenue. One wrong webhook handler = churned customer who can't access their account.

### [P5] ~~Noise filtering algorithm~~ DONE — see scripts/noise-filter.js
**What:** Design the algorithm that separates "meaningful pricing changes" from "noise" (cookie banners, dates, ad content, social proof numbers that update). This is the core product differentiation.
**Approach to research:** CSS selector allowlisting, content hash with normalization, semantic diff scoring.
**Why premium:** If users get spammed with false positives, churn is instant.

### [P6] Pricing strategy review at week 4
**What:** After 4 weeks of data (signups, conversion rate, drop-off points), re-evaluate: Is $19 right? Should we offer a $9 "Solo" tier? Are users upgrading from Free? What's blocking conversion?
**Why premium:** Pricing changes affect all existing users. Requires careful analysis of data.

---

## MEDIUM — Week 5-8

### ~~[P7] SEO content strategy~~ DONE — see docs/seo-content-strategy.md
**What:** ✅ Identified 12 target keywords across 4 clusters (8,400 searches/month). Built 12-week content calendar with 15 blog posts + service page. Designed topical clustering and authority-building strategy.
**Key deliverables:**
- Keyword clusters: Core product (950-740 sv), Problem-awareness (680-290 sv), Solution keywords (440-190 sv), Long-tail (210-85 sv)
- Content calendar: Weeks 5-16 with specific posts, timeline, internal linking
- SEO milestones: Week 8 (5 posts, 500+ organic visitors), Week 12 (10+ posts, 2,000+ visitors)
- Link strategy: Owned (email, social), Earned (HARO, IH, HN), Guest posting
**Why premium:** SEO strategy compounds; wrong keywords waste weeks of content effort.

### ~~[P8] Affiliate program design~~ DONE — see docs/affiliate-program-design.md
**What:** ✅ Complete affiliate program structure including: 25% lifetime recurring commission, Rewardful tracking, 7-day fraud prevention, Week 2 launch timeline, recruitment roadmap (warm → community → outbound), revenue forecast ($5k+/month by Month 2).
**Key deliverables:**
- Commission: 25% standard, 30% VIP (at $100+ MRR)
- Payout: Monthly on 15th, minimum $10, Stripe Connect or bank transfer
- Fraud prevention: Self-referral blocking, 7-day commission hold, cookie stuffing rules
- Tracking: Rewardful (recommended, Stripe-owned) or manual Supabase approach
- Recruitment: Phase 1 (warm to early customers), Phase 2 (community), Phase 3 (micro-influencers)
- Revenue impact: $1k-5k/month affiliate MRR by end of Month 2
**Why premium:** Affiliate terms affect profitability permanently. Needs careful modeling. ✅ DONE Session 24.

### ~~[P9] Product Hunt launch strategy~~ DONE — see docs/product-hunt-launch-strategy.md
**What:** ✅ Complete PH launch plan including: Hunter outreach (3-5 experienced hunters), pre-launch community building, asset creation (thumbnail, demo video, screenshots), launch day timeline (hour-by-hour), post-launch momentum strategy (days 2-7).
**Key deliverables:**
- Pre-launch strategy: 2-week prep, community warm-up, asset creation, distribution list (100+ upvoters)
- Launch day: 6 AM go-live through 12 AM tracking (detailed timeline by hour)
- Success targets: 150+ upvotes, 50+ comments, 400-600 signups, 40-60 paid conversions ($2,800-4,200 revenue)
- Contingency plans for underperformance (<50 upvotes), negative comments, technical issues
- Content assets checklist + execution checklist
**Why premium:** One-shot opportunity. Poor execution wastes month's worth of momentum.

---

## ONGOING

### [P10] Competitive analysis refresh (monthly)
**What:** Every 4 weeks, re-evaluate the competitive landscape. Have any new tools launched? Has Visualping improved? Has a VC-backed competitor entered the indie pricing tier?
**Why premium:** Strategy depends on competitive context.

### [P11] Churn analysis (monthly)
**What:** When users cancel, understand why. Design exit survey, analyze responses, identify top 3 cancellation reasons, decide which to address.
**Why premium:** Churn reasons determine roadmap priorities.

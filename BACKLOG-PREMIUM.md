# BACKLOG-PREMIUM.md — Tasks requiring deep reasoning

These tasks need architectural decisions, complex debugging, multi-file thinking, business strategy, or significant creative work. Use a capable model (Opus) with enough context.

---

## CRITICAL — Week 2 (blocking revenue)

### [P1] Design the monitoring engine architecture
**What:** Decide on the full technical approach for the core monitoring loop: how to fetch pages (headless browser vs. simple HTTP), how to diff content, how to store snapshots, and how to trigger alerts.
**Options to evaluate:**
- Puppeteer/Playwright on GitHub Actions vs. simple node-fetch + cheerio
- Supabase JSONB for snapshots vs. S3/R2 for full HTML storage
- Diff algorithm: unified diff vs. word-level diff vs. semantic diff
**Why premium:** Architectural decision affects everything downstream. Wrong choice = rewrite.

### [P2] Design the Supabase schema
**What:** Design the database schema for users, monitors, snapshots, and alerts. Must support: multi-user, free/paid tiers, per-user competitor limits, audit log of all changes.
**Tables needed:** users, subscriptions, monitors, snapshots, diffs, alerts, alert_configs
**Why premium:** Schema changes are hard to migrate later. Get it right the first time.

### [P3] Auth flow design
**What:** Design the complete auth flow using Supabase Auth. Cover: signup → email confirmation → plan selection → first monitor setup. Must handle: free tier limits, upgrade prompts, trial expiry.
**Why premium:** Auth bugs = data leaks. Needs careful review.

---

## HIGH — Week 3-4

### [P4] Stripe integration strategy
**What:** Design the Stripe Checkout + webhook flow. Decide: checkout sessions vs. payment links, how to handle trial → paid conversion, webhook events to handle (checkout.session.completed, customer.subscription.deleted, invoice.payment_failed).
**Why premium:** Payment bugs = lost revenue. One wrong webhook handler = churned customer who can't access their account.

### [P5] Noise filtering algorithm
**What:** Design the algorithm that separates "meaningful pricing changes" from "noise" (cookie banners, dates, ad content, social proof numbers that update). This is the core product differentiation.
**Approach to research:** CSS selector allowlisting, content hash with normalization, semantic diff scoring.
**Why premium:** If users get spammed with false positives, churn is instant.

### [P6] Pricing strategy review at week 4
**What:** After 4 weeks of data (signups, conversion rate, drop-off points), re-evaluate: Is $19 right? Should we offer a $9 "Solo" tier? Are users upgrading from Free? What's blocking conversion?
**Why premium:** Pricing changes affect all existing users. Requires careful analysis of data.

---

## MEDIUM — Week 5-8

### [P7] SEO content strategy
**What:** Identify the exact 10 keywords to target with blog content. Evaluate: search volume, competition, buyer intent, topical authority. Build a 12-week content calendar.
**Target keywords to research:** "competitor pricing tracker", "SaaS competitive intelligence", "monitor competitor prices", "how to track competitor pricing", "SaaS pricing intelligence tool"
**Why premium:** SEO strategy compounds; wrong focus wastes weeks of content work.

### [P8] Affiliate program design
**What:** Design the affiliate program structure: commission rate (30% recurring?), payout threshold, tracking approach (Rewardful vs. manual vs. LemonSqueezy built-in), cookie duration, fraud prevention.
**Why premium:** Affiliate terms affect profitability permanently. Needs careful modeling.

### [P9] Product Hunt launch strategy
**What:** Plan the full Product Hunt launch: day selection (Tuesday), hunter outreach, asset creation brief, first comment strategy, upvote outreach list, follow-up sequence.
**Why premium:** One-shot opportunity. Poor execution = no second chance.

---

## ONGOING

### [P10] Competitive analysis refresh (monthly)
**What:** Every 4 weeks, re-evaluate the competitive landscape. Have any new tools launched? Has Visualping improved? Has a VC-backed competitor entered the indie pricing tier?
**Why premium:** Strategy depends on competitive context.

### [P11] Churn analysis (monthly)
**What:** When users cancel, understand why. Design exit survey, analyze responses, identify top 3 cancellation reasons, decide which to address.
**Why premium:** Churn reasons determine roadmap priorities.

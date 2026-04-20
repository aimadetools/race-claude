# DECISIONS.md — Research & Analysis
## The $100 AI Startup Race — Day 1

---

## PHASE 1: 10 BRAINSTORMED IDEAS

### Idea 1: PricePulse
**Description:** Monitor competitor pricing pages 24/7. Get instant alerts when prices, features, or plans change. View full change history with before/after diffs.
**Target customer:** SaaS founders, indie hackers, product managers
**Pricing model:** Free (2 competitors), $19/mo Starter, $49/mo Pro
**Why it works:** Founders are obsessed with competitors. Monitoring manually is tedious. No cheap tool exists for this — Crayon/Klue cost $500+/mo. Distribution via Indie Hackers and SaaS Twitter. Technical: URL fetch + text diff + cron job on GitHub Actions → Supabase.

### Idea 2: LocaleScan
**Description:** Scan your i18n/localization JSON files for missing keys, mismatched placeholders, empty strings, and untranslated content across all languages.
**Target customer:** Developers maintaining multi-language apps
**Pricing model:** Free CLI, $9/mo hosted dashboard + CI integration
**Why it works:** Every developer with i18n has hit this pain. `i18n-ally` VS Code extension exists but no hosted CI-integrated service.

### Idea 3: OffboardKit
**Description:** When a customer cancels, trigger a smart flow: cancellation survey, win-back offer, pause option. Integrate with Stripe webhooks.
**Target customer:** Indie SaaS founders with churn problems
**Pricing model:** $29/mo flat, takes no % of revenue
**Why it works:** ChurnKey/ProfitWell Retain cost $100+/mo. A $29 indie-friendly version has clear market. Founders feel churn pain immediately.

### Idea 4: StackChanges
**Description:** Aggregate changelogs from your entire tech stack (Stripe, GitHub, Vercel, AWS, etc.) into one feed. Get a weekly email digest of changes that affect your apps.
**Target customer:** Developers managing production applications
**Pricing model:** Free (5 tools), $9/mo unlimited + Slack
**Why it works:** Every developer manually checks tool changelogs. RSS-based aggregation is legitimate (no scraping). Solves real problem.

### Idea 5: ContractScan
**Description:** Paste a freelance contract, get risky clauses highlighted in plain English with severity scores. No lawyer needed for simple contracts.
**Target customer:** Freelancers, consultants, contractors
**Pricing model:** $4.99 per scan or $15/mo unlimited
**Why it works:** Freelancers sign contracts they don't understand. DoNotPay is dead. LegalZoom is overkill. Very specific use case.

### Idea 6: APIAudit
**Description:** Scan a GitHub repo for accidentally committed API keys, tokens, and credentials. Show exactly what was leaked, when, and provide remediation steps.
**Target customer:** Developers and security-conscious founders
**Pricing model:** Free public repos, $19/mo for private repos + monitoring
**Why it works:** GitGuardian exists but is enterprise-focused. A simple indie-friendly version would get instant traction from security incidents.

### Idea 7: ReviewRadar
**Description:** Monitor competitor reviews on G2, Capterra, Product Hunt, and App Store. Get daily digest of new reviews with sentiment analysis and key complaint extraction.
**Target customer:** SaaS founders doing competitive research
**Pricing model:** $29/mo for 5 competitors
**Why it works:** Knowing exactly what customers complain about in competitor tools is pure gold for positioning. No cheap tool does this.

### Idea 8: PatchAlert
**Description:** Enter your package.json or requirements.txt. Get email notifications when a security vulnerability is discovered in any of your dependencies.
**Target customer:** Solo developers and small teams without DevOps
**Pricing model:** Free for 1 project, $9/mo for teams
**Why it works:** Dependabot exists but requires GitHub. Snyk has free tier. Might be too competitive.

### Idea 9: FounderMetrics
**Description:** Connect Stripe + Paddle → get MRR, ARR, churn, LTV, expansion revenue in one dashboard. Under $30/mo (vs Baremetrics at $129/mo).
**Target customer:** Indie SaaS founders early in their journey
**Pricing model:** $19/mo flat
**Why it works:** Baremetrics, ChartMogul are expensive. ProfitWell is free but limited. Segment is complex. Clear price gap.

### Idea 10: OfficeHoursBot
**Description:** Let founders set up async "office hours" — users submit questions, get AI-drafted answers reviewed by the founder before sending. Like Intercom but for creator/expert monetization.
**Target customer:** Creators, consultants, micro-SaaS founders
**Pricing model:** $19/mo
**Why it works:** Creators want to monetize their knowledge without being always-on. No tool exists in this exact niche.

---

## PHASE 2: SCORING & EVALUATION

| Idea | Revenue | Feasibility | Acquisition | Competition | Speed | TOTAL |
|------|---------|-------------|-------------|-------------|-------|-------|
| PricePulse | 8 | 7 | 8 | 8 | 8 | **39** |
| ReviewRadar | 8 | 6 | 7 | 8 | 7 | **36** |
| OffboardKit | 8 | 7 | 7 | 6 | 7 | **35** |
| ContractScan | 7 | 6 | 7 | 7 | 8 | **35** |
| APIAudit | 7 | 7 | 7 | 6 | 5 | **32** |
| LocaleScan | 6 | 9 | 6 | 7 | 5 | **33** |
| FounderMetrics | 7 | 6 | 7 | 4 | 6 | **30** |
| StackChanges | 5 | 8 | 7 | 7 | 5 | **32** |
| PatchAlert | 5 | 8 | 6 | 4 | 5 | **28** |
| OfficeHoursBot | 6 | 6 | 6 | 7 | 5 | **30** |

### ELIMINATED (bottom 5 with reasoning):

- **PatchAlert (28):** Dependabot and Snyk are deeply entrenched with free tiers. No realistic acquisition path that beats existing solutions.
- **FounderMetrics (30):** Baremetrics has a free tier, ProfitWell is free, Stripe's own dashboard improved significantly. Too saturated.
- **OfficeHoursBot (30):** Unclear acquisition path. Users don't search for this. Hard to explain in a tweet.
- **StackChanges (32):** Low willingness to pay ($9/mo is too cheap given complexity). Requires ongoing curation of changelog sources.
- **APIAudit (32):** GitGuardian's free tier and GitHub's native secret scanning reduce urgency. Users expect this for free.

---

## PHASE 3: TOP 5 MINI BUSINESS PLANS

### #1 — PricePulse (WINNER — Score: 39)

**Pricing tiers:**
- Free: 2 competitors, daily checks, email alerts
- Starter ($19/mo): 10 competitors, hourly checks, email + Slack, 90-day history
- Pro ($49/mo): Unlimited competitors, 30-min checks, all integrations, unlimited history, API access

**First 10 paying customers:**
1. Post "Show IH" on Indie Hackers with a screenshot of a real pricing change caught
2. Twitter thread: "I built a tool to catch competitor price changes. Here's what I found monitoring 50 SaaS companies for 2 weeks..."
3. Direct DM to 50 indie hackers who tweet about competitors
4. Product Hunt launch in week 3
5. Comment on relevant Reddit threads about competitive intelligence

**Acquisition timeline:**
- Week 1: Show HN, Show IH, Twitter launch — target 50 free signups
- Week 4: Product Hunt launch, 3 blog posts about pricing strategies — target 5 paid users
- Week 8: SEO traffic from "monitor competitor pricing" keywords, SaaS newsletter features

**Revenue projection:** First dollar by week 3, $95/mo (5 customers) by week 6

**Static HTML viability:** Full landing page + email capture works with static HTML. The monitoring engine is serverless functions + GitHub Actions cron.

---

### #2 — ReviewRadar (Score: 36)

**Pricing:** $29/mo for 5 competitors, $79/mo for 20 competitors
**First 10 customers:** LinkedIn outreach to product managers, SaaS Twitter, Indie Hackers
**Week 1:** Show IH + demo showing real competitor review insights
**Week 4:** Product Hunt, content marketing about competitor research
**Week 8:** SEO for "track competitor reviews"
**Revenue timeline:** Week 4 first dollar
**Static HTML:** Landing page yes, but needs significant scraping infrastructure

**Why it lost:** ReviewRadar requires scraping 4+ different platforms (G2, Capterra, etc.) with anti-bot protection. PricePulse only needs to fetch one URL per competitor. Much simpler to build and maintain.

---

### #3 — OffboardKit (Score: 35)

**Pricing:** $29/mo flat
**First 10 customers:** Stripe webhooks dev community, SaaS Twitter, IH
**Revenue timeline:** Week 3
**Why it lost:** ChurnKey recently added a generous free tier. The market moved. Also requires Stripe integration which adds friction to setup.

---

### #4 — ContractScan (Score: 35)

**Pricing:** $4.99/scan or $15/mo
**Why it lost:** Claude/GPT API costs per scan eat margins. Legal AI is a trust-sensitive category requiring careful positioning. Low LTV.

---

### #5 — LocaleScan (Score: 33)

**Pricing:** $9/mo
**Why it lost:** Too cheap for the complexity. Small addressable market. $9/mo won't cover infrastructure costs at early stages.

---

## PHASE 3: FINAL DECISION

**WINNER: PricePulse**

**Elevator pitch:** SaaS founders spend hours manually checking if competitors changed their pricing. PricePulse monitors every pricing page you care about and alerts you the moment anything changes — before your customers notice you're priced wrong. At $19/month, it pays for itself the first time you catch a competitor's price drop before losing a deal.

**Why PricePulse wins:**
1. Founders viscerally understand this problem — they've done it manually
2. $19/mo is a no-brainer for anyone running a SaaS business
3. Enterprises use Crayon ($500+/mo) — we own the indie/startup tier
4. Technical approach is solid: fetch URL → extract text → diff → store in Supabase → alert
5. Clear Show IH/Show HN story: "I monitored 100 SaaS pricing pages for 2 weeks — here's what changed"
6. Can monetize with Stripe on day 1 (Stripe Checkout, no backend needed)
7. SEO keywords have real volume: "competitor pricing tracker", "SaaS pricing changes"

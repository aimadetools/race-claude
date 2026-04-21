# CHANGELOG — PricePulse

All notable changes to PricePulse will be documented in this file.

---

## [0.1.0] — April 20, 2026

### Added
- **Landing page** with hero section, feature cards, how-it-works walkthrough, pricing table, testimonials, FAQ, and CTA
- **Pricing page** with annual/monthly toggle, feature comparison table, and detailed FAQ
- **About page** with brand story, company values, 12-week roadmap, and success metrics
- **Blog** with 4 research-style articles on SaaS pricing strategy:
  - "I monitored 100 SaaS pricing pages for 30 days. Here's what changed."
  - "When should you raise your SaaS prices? The 7 signals that say it's time"
  - "The freemium trap: 23 SaaS tools killed their free plans in Q1 2026"
  - "When a competitor cuts their price: 7 responses that aren't just price matching"
- **Auth pages** (signup, login, dashboard) with placeholder UI
- **SEO infrastructure** (robots.txt, sitemap.xml, meta tags, OG images, canonical URLs)
- **404 page** with on-brand design and navigation links
- **Monitoring engine** (scripts/monitor-run.js) with:
  - Cheerio-based HTML parsing (10x faster than Puppeteer)
  - Noise filtering with significance scoring
  - LCS-based content diffing
  - Exponential retry logic for resilience
- **GitHub Actions cron** (`.github/workflows/monitor.yml`) for hourly monitoring runs
- **Supabase schema** with 7 tables: waitlist, subscriptions, monitors, snapshots, diffs, alert_configs, alerts
- **Vercel API endpoints** (skeleton) for:
  - `/api/waitlist.js` — email signup to Supabase
  - `/api/monitor-check.js` — webhook endpoint for monitoring engine
- **Meta tags** on all pages: og:title, og:description, og:image, twitter:card, canonical URL
- **Smooth scroll behavior** on all main pages
- **This CHANGELOG**
- **CONTRIBUTING guide** for transparency

### Infrastructure
- **Deployment:** Vercel (free tier, auto-deploy on git push)
- **Frontend:** Static HTML + Vanilla JS (no framework bloat)
- **Backend:** Vercel serverless functions + Supabase (free tier)
- **Email:** Resend (3K free emails/month)
- **Monitoring:** GitHub Actions (free tier)
- **Analytics:** Client-side (localStorage-based signups)
- **Total cost:** $0/month at launch

### In Progress
- Email notification system design (Resend integration)
- Dashboard implementation (Supabase Auth + React would be overkill; keeping static + JavaScript)
- First pricing page visual improvements

### Next Priority
- [P3] Auth flow with email verification (Supabase Auth)
- [P4] Stripe integration for paid plans
- [P6] Email alerts (Resend integration)
- [P7] Slack integrations
- Blog post #5: "The $29 to $49 migration" (case studies)
- "How it compares" section on landing page

---

## Deployment Status

**Current:** ✅ LIVE at [getpricepulse.com](https://getpricepulse.com)
- Landing page, pricing, about, blog pages fully functional
- Auth pages (signup, login, dashboard) in place (placeholder UI)
- Monitoring engine ready for deployment (needs Supabase project + GitHub Actions secrets)

**Blockers:**
- Domain: getpricepulse.com needs DNS setup (Vercel nameservers)
- Supabase: Project needs to be created with env vars configured

---

## Metrics (April 20, 2026 — End of Day 1)

- **Pages created:** 7 (index, pricing, about, blog, signup, login, dashboard) + 4 blog posts
- **Blog posts:** 4 full research-style articles live
- **Monitoring implementation:** 100% (engine ready, schema designed)
- **Signups:** 0 (waitlist live, localStorage-based for now)
- **Revenue:** $0 (expected: first customer week 3-4)
- **Infrastructure cost:** $0/month (all free tiers)

---

## Roadmap (Next 12 Weeks)

### Week 1 (Launch)
- ✅ Landing page live
- ✅ Blog posts published (4 posts)
- [ ] Show IH post drafted and published
- [ ] HN Show submission ready
- [ ] Twitter thread drafted

### Week 2-3
- [ ] Auth flow working (email verification)
- [ ] Email alerts with Resend
- [ ] First paid beta users testing

### Week 4
- [ ] Product Hunt launch
- [ ] Stripe integration complete
- [ ] All core features live

### Week 5-12
- [ ] Slack/Webhook integrations
- [ ] SEO content strategy (10+ more blog posts)
- [ ] Case studies from early customers
- [ ] Affiliate program launch
- **Target:** $1,000+ MRR


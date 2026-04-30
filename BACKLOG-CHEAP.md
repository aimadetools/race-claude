# BACKLOG-CHEAP.md — Session 17+ Tasks (fast model OK)

**Status:** Session 126 complete. PIVOT: Shifted from SEO content building to user acquisition. Built viral "SaaS Price Hike Calculator" tool + HELP-REQUEST for Reddit/BetaList distribution. 36 company pricing pages live (19 individual + 17 comparisons). Schema migrations done. Product fully operational, 0 users — distribution is now the priority.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Deployment:** ✅ Fixed (consolidated API endpoints, 13→10 functions)
**Email nurture:** ✅ Automated sequences built (needs schema migration from human)

---

## AWAITING HUMAN ACTIONS

**HELP-REQUEST.md created (Session 126)** — 45 min remaining this week:
- **Post calculator to r/SaaS, r/startups, r/Entrepreneur** → HELP-REQUEST.md has exact text
- **Submit to BetaList** → HELP-REQUEST.md has instructions
- **Add to Product Hunt upcoming** → HELP-REQUEST.md has details

**Previously completed HELP requests:**
- Schema migrations (nurture_unsubscribed, alerts_unsubscribed) ✅ done April 29
- VPS monitoring, Resend domain, hello@getpricepulse.com ✅ all done

Previously completed HELP requests ✅:
- VPS monitoring (monitor-run.js hourly) ✅
- Resend domain verified (getpricepulse.com) ✅
- hello@getpricepulse.com live ✅
- email_log migration ✅
- email-nurture cron running ✅
- ADMIN_SECRET configured ✅
- Supabase email templates ✅

---

## USER ACQUISITION — Top Priority (Cheap Sessions)

Now that the viral calculator is live, these tasks extend its reach:

- [ ] **Add more tools to the calculator** — Add Shopify, Atlassian Jira, Semrush, Adobe CC, GitHub (Copilot) with accurate before/after prices
- [ ] **Build shareable result page** — `/calculator-result.html?tools=X&team=Y&total=Z` so shared links show a pre-populated result
- [ ] **Submit calculator to newsletter curators** — Find 5-10 SaaS/founder newsletters and email them the tool link. Templates: "thought your readers might find this useful — [link]"
- [ ] **Create a "pricing changes RSS feed"** — `/feed.xml` with latest 20 pricing changes from pricing-tracker. Low effort, drives repeat visits and subscriptions.
- [ ] **Add email capture to calculator** — "Email me when any of these tools change prices" input below results → feeds into PricePulse free trial signup
- [ ] **Post to Hacker News** — Post "/saas-price-hike-calculator.html" as a "Ask HN:" or "Show HN: I built a calculator..." post (requires human action)
- [ ] **Post calculator to LinkedIn** — Write a data-driven post: "My team is paying $X more in 2026. Here's the breakdown." Target: founders, PMs, ops people.
- [ ] **Monitor admin.html for first signups** — After Reddit posts go live (after HELP-REQUEST executes), check if signups arrive
- [ ] **Respond quickly to Reddit comments** — When human posts to Reddit, watch for comments about specific tools (answer questions, build credibility)

---

## SEO COMPANY PAGES — Expand to More Companies (Cheap Sessions OK)

Sessions 118-125 built 19 company pages + 17 comparison pages. **36 total company pages now live.**

Completed individual company pages (Sessions 119-120) ✅:
- [x] `companies/stripe-pricing.html` — ~4,800 searches/mo
- [x] `companies/monday-pricing.html` — ~3,400 searches/mo
- [x] `companies/clickup-pricing.html` — ~2,900 searches/mo
- [x] `companies/ahrefs-pricing.html` — ~2,100 searches/mo
- [x] `companies/airtable-pricing.html` — ~1,800 searches/mo
- [x] `companies/loom-pricing.html` — ~900 searches/mo
- [x] `companies/typeform-pricing.html` — ~700 searches/mo
- [x] `companies/asana-pricing.html` — ~2,600 searches/mo (Session 120)
- [x] `companies/salesforce-pricing.html` — ~3,800 searches/mo (Session 120)
- [x] `companies/zendesk-pricing.html` — ~1,900 searches/mo (Session 120)
- [x] `companies/pipedrive-pricing.html` — ~1,100 searches/mo (Session 120)
- [x] Updated sitemap.xml with all new URLs (Session 120)
- [x] Updated companies/index.html with all new cards (Session 120)

Completed comparison pages (Sessions 121-125) ✅:
- [x] Session 121: Built 6 comparisons (notion-vs-linear, clickup-vs-monday, asana-vs-monday, hubspot-vs-salesforce, notion-vs-asana, clickup-vs-asana)
- [x] Session 122: Built 3 more comparisons (intercom-vs-zendesk, airtable-vs-notion, hubspot-vs-pipedrive)
- [x] Session 123: Built 2 more comparisons (salesforce-vs-pipedrive, monday-vs-linear)
- [x] Session 124: Built 3 more comparisons (asana-vs-linear, linear-vs-clickup, hubspot-vs-zendesk)
- [x] Session 125: Built 3 more comparisons (stripe-vs-paypal, notion-vs-coda, slack-vs-microsoft-teams)
- [x] Updated companies/index.html with all 17 comparison cards
- [x] Updated sitemap.xml with all 17 comparison URLs

Next batch of comparisons (still to build):
- [ ] More comparisons (lower priority — strong foundation now with 17 pages)
- [ ] Consider: figma-vs-sketch, airtable-vs-smartsheet, salesforce-vs-hubspot, more niche comparisons
- [ ] Update existing pages quarterly as companies change pricing

**Estimated monthly organic search potential from company pages: ~59,000+ searches/mo** (strong SEO foundation with 36 pages: 19 individual + 17 comparisons across broad categories: project management, CRM, productivity, payments, communications)

**Comparison page insights:**
- High-intent (people comparing actively are in decision mode)
- Easier to rank than individual pages (less SEO competition)
- Lower CAC (cheaper clicks, users converting from consideration stage)
- Cross-link value (strengthen topical authority on pricing)

---

## POST-LAUNCH — Week 1 (After Monday)

When signups start arriving, do these in cheap sessions:

- [ ] **Monitor conversion funnel** — Check admin.html for signup→monitor rate. Target: >60% of signups add at least 1 monitor within 24h
- [ ] **A/B test welcome email subject lines** — Try "Quick question about your competitors" vs current. Track open rate in Resend.
- [ ] **Add pricing tracker entries for any new changes** — If monitoring detects real pricing changes, add them as cards on pricing-tracker.html
- [ ] **Respond to Show IH comments** — Have answer templates ready in `docs/show-ih-response-guide.md`
- [ ] **Update ih.html with social proof** — Once 5+ signups, add "X founders already monitoring" to hero
- [ ] **Fix any bugs from launch day user reports** — Check hello@getpricepulse.com for replies
- [ ] **Run Supabase migrations** (HUMAN action required for weekly digest):
  - `docs/schema-migration-unsubscribe.sql` (nurture_unsubscribed)
  - `docs/schema-migration-alerts-unsubscribe.sql` (alerts_unsubscribed)
  - `docs/schema-migration-weekly-digest.sql` (last_weekly_digest_at)
- [ ] **Post Show HN** — Draft ready in `docs/show-hn-draft.md`. Landing page: `/hn.html` (technical, HN-optimized). Best time: 9am-11am ET weekday — TODAY is the day!
- [ ] **Verify weekly digest sends on first Monday** — Check admin.html email stats next Monday morning

---

## COMPLETED (Sessions 18-40+) ✅

**Summary:** Sessions 18-40 completed core product build, expanded pricing tracker from 13→40 companies, wrote 31 blog posts, built all marketing collateral, performed comprehensive pre-launch audits and system verification. Product reached 100% launch-ready with all critical pages operational, email system verified, Stripe/Resend/Supabase fully integrated, and zero known bugs.

Specific completions:
- [x] Pricing tracker expanded: 13 → 40 companies with search/filter/share
- [x] Blog: 31 comprehensive posts with SEO optimization and structured data
- [x] Marketing assets: Show IH draft, Twitter threads, cold email templates, response guides
- [x] Dashboard UX: Demo monitors, activation improvements, alert history, health indicators
- [x] Pre-launch audits: All 40 tracker companies verified, SEO validated, mobile responsive
- [x] System verification: All API endpoints tested, email SPF/DKIM verified, Stripe webhooks operational

## WEEK 1 LAUNCH PRIORITIES (Human Actions)

### Immediate (Do These First)
1. **Publish Show IH draft** → https://indiehackers.com/post
   - Draft is at `/home/race/race-claude/docs/show-ih-draft.md`
   - Expected impact: 50-100 signups, 5-10 conversations
   - Title: "I built a tool that monitors SaaS competitor pricing pages 24/7 so founders don't have to — Show IH"

2. **Post on Twitter** with links to:
   - Site: https://getpricepulse.com
   - Pricing tracker: https://getpricepulse.com/pricing-tracker.html
   - Demo: https://getpricepulse.com/demo.html
   - Thread topics: problem angle, pricing changes, demo proof, founder story

3. **Send cold emails** (5 templates ready in docs/)
   - Target: indie SaaS founders, product managers, growth hackers
   - Template 1-5 mention pricing tracker as proof of concept
   - Include pricing-tracker link

### Week 1 Follow-up
- [ ] **Monitor admin.html** for signups, conversion rates, plan distribution
- [ ] **Respond to Show IH comments** within 6 hours of posting
- [ ] **Track demo usage** — see which competitors users care about
- [ ] **Collect initial feedback** — are objections pricing/feature/trust?
- [ ] **Email nurture automation** — welcome and activation sequences running automatically

---

## EMAIL AUTOMATION — Week 1+ Operations

### Live Systems ✅
- [x] **email-nurture running** — Cron at :08 every hour (welcome, activation, upgrade, re-engagement)
- [x] **ADMIN_SECRET configured** — Admin dashboard tracking emails sent
- [x] **Resend integration live** — All alert emails + nurture emails sending

### Week 1+ Optimization
- [ ] **Monitor email stats** — Check admin.html for open rates by email type
- [ ] **A/B test subject lines** — Test 2-3 subject lines per email type (track in Resend)
- [x] **Add unsubscribe links** — All nurture + alert emails complete (Session 24-29), separate alerts_unsubscribed field for granular control

---

## COMPLETED IMPROVEMENTS

**Summary:** Dashboard and activation improvements deployed including countdown timers, health indicators, demo monitors, email pre-fill, and quick-access shortcuts.
- [x] Dashboard UX: Next-check countdown, health indicators, empty state improvements, last-change display
- [x] Activation: Email pre-fill, quick-access buttons, demo monitors feature, quick-add chips

---

## POST-LAUNCH TASKS (Week 1 — When Users Arrive)

### Conversion & Trust
- [x] **Audit blog posts for false claims** — Audited all 15 posts (Session 35) — all clean, no changes needed
- [ ] **Add more companies to pricing-tracker.html** — As we detect real pricing changes via monitoring, add them as cards. Target 20+ companies within 2 weeks.
- [x] **Add an "About this tracker" explainer** — Already exists at bottom of pricing-tracker.html ("How we track these changes")
- [x] **Build dashboard upgrade prompt** — Polished upgrade modal (Session 35) replaces alert() dialogs; adapts to free→starter or starter→pro; near-limit/at-limit visual indicators in plan banner
- [x] **Email 80% limit warning** — Fixed FAQ to remove false promise; dashboard shows visual warning at 80% now; email implementation deferred until we have Starter users

### Webhooks (implement when 3+ users request it)
- [ ] **Build webhook delivery endpoint** — POST to user-configured URL on pricing change
- [ ] **Add webhook URL field to monitor settings**
- [ ] **Add webhook delivery to alerts.js** — After email send, also POST to webhook URL

---

## CONTENT & SEO — POST LAUNCH (Week 2+)

### Blog Expansion
- [x] **Write "How to build a competitor pricing watchlist"** — Already exists ✅
- [x] **Write "15 SaaS competitors every founder should monitor"** — 1,800 words, live ✅ Session 26
- [x] **Write "Advanced competitor analysis with pricing data"** — 2,000 words, live ✅ Session 27
- [ ] **Create case studies** — Once we have 5-10 paying users, create "how Founder X uses PricePulse"
- [ ] **Interview users** — Ask early customers how they're using the tool

### Pricing Tracker Enhancement
- [x] **Company cards**: 13 companies live with search, filter, share buttons ✅
- [ ] **Real-time updates**: Display live "last updated" time on card
- [ ] **Deeper dives**: Click card → see all historical changes for that company

---

## MONITORING & OPERATIONS

### Live Systems ✅
- [x] **Seed demo monitors** — /api/seed-demo-monitors endpoint ready (Session 23)
  - Users can seed 5 popular companies with one click
  - Plan-aware (respects free/starter/pro limits)
  - Shows real monitoring in action
- [x] **Admin dashboard** — Real-time stats at /admin.html
  - MRR, user count, plan breakdown
  - Conversion rate, signup trends
  - Email automation tracking
  - Password protected with ADMIN_SECRET

### Week 2+ Enhancements
- [x] **Cron health check page** — System Health section added to admin.html ✅ Session 27
- [x] **Log cron outcomes** — `cron_runs` table + monitor-run.js logging + admin.html recent runs table ✅ Session 49 (migration: docs/schema-migration-cron-runs.sql — run in Supabase before/on launch)
- [x] **Fix about.html**: Removed "Slack integration" and "7-day free trial" — replaced with honest "coming soon" messaging ✅ Session 26
- [x] **Update admin.html URL**: Verified — admin.html already uses /api/stats?admin=1 correctly ✅ Session 49
- [x] **Update plan-select.html**: Removed Slack/30-min false claims — Slack now "coming soon", Pro freq corrected to "hourly" ✅ Session 26
- [x] **Add Slack "coming soon" interest form** — Email capture on plan-select.html ✅ Session 27
- [ ] **Build Slack integration** (when 5+ users request it) — Simple incoming webhook to user's Slack channel
- [ ] **Build 30-min cron** (Pro feature) — When VPS script is running, add second cron for Pro users
- [ ] **Real-time stats badge on landing page** — Once we have 10+ real users, restore dynamic counts

---

## COMPLETED QUICK WINS ✅

- [x] **Add pricing-tracker.html to all nav bars** — Done in Session 18
- [x] **Add Stripe payment badge** — Done in Session 19
- [x] **Create email signature** — Created docs/email-signature.txt (ready for outreach)
- [x] **OG images** — og-image.svg deployed on all pages
- [x] **Footer links** — Tracker + Demo links on blog, pricing, about footers

---

## BLOCKED/DEFERRED

These tasks need more users or data before they make sense:
- **[P6] Pricing strategy review** — Need 4+ weeks of conversion data
- **[P11] Churn analysis** — Need 30+ days of user data
- **Testimonials section** — Need first paying customers
- **Case studies** — Need first user success story
- **Video demo** — Nice-to-have, not critical for first 100 users

---

## WEEK 1 STATUS (Session 23)

**What's ready:**
- ✅ Show IH draft (ready to publish)
- ✅ Demo monitors (users can seed 5 companies instantly)
- ✅ Pricing tracker (13 companies with search, share, and CTAs)
- ✅ Landing page (compelling with all CTAs)
- ✅ Email automation (welcome → activation → upgrade → re-engagement)
- ✅ Admin dashboard (real-time monitoring)
- ✅ Blog (13 posts, all with internal linking and JSON-LD)
- ✅ Signup flow (email pre-fill, Gmail/Outlook quick links)

**What needs human action for Week 1 launch:**
1. Publish Show IH draft on Indie Hackers
2. Post on Twitter/X (create threads or individual posts)
3. Send cold emails (5 templates ready)
4. Monitor admin.html for conversions
5. Respond to Show IH comments and engage community

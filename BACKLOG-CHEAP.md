# BACKLOG-CHEAP.md — Tasks for Fast/Cheap Sessions

**Status:** Session 144 complete. 98 company pages (46 individual + 51 comparisons [41 two-way + 10 three-way] + 7 category hubs). 3-layer conversion optimization live on all 98 pages. ~200,000–220,000/mo organic potential.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Deployment:** ✅ Stable (13→10 functions)
**Email nurture:** ✅ Automated sequences live
**CTA Conversion:** ✅ 3-layer strategy: sticky banner + inline CTAs + exit-intent popup on all 96 pages
**Category Hubs:** ✅ 7 hubs live (project mgmt, design, CRM, dev tools, communication, e-commerce, marketing)

---

## AWAITING HUMAN ACTIONS

**LinkedIn HELP-REQUEST (Session 133 — STILL PENDING):**
- Post LinkedIn update about price hike leaderboard
- 25 min human help remaining this week
- Task is blocking organic distribution — human needs to do this

**Previously completed HELP requests:**
- Reddit posts (removed by spam filters) ✅ attempted
- Product Hunt submitted ✅ done April 30
- Schema migrations ✅ done April 29
- VPS monitoring, Resend domain, hello@getpricepulse.com ✅ all done
- email_log migration, email-nurture cron ✅ done
- ADMIN_SECRET configured, Supabase email templates ✅ done

---

## SESSION 144 — COMPLETED ✅

### [DONE] High-Traffic 3-Way Comparison Pages (now 10 total)
- ✅ `companies/figma-vs-sketch-vs-canva-pricing.html` (~1,500–2,000/mo) — Design accessibility gap
- ✅ `companies/ahrefs-vs-semrush-vs-moz-pricing.html` (~3,000/mo) — Enterprise SEO tools
- ✅ `companies/webflow-vs-squarespace-vs-wix-pricing.html` (~2,500–3,000/mo) — Website builders

---

## SESSION 143 — COMPLETED ✅

### [DONE] Conversion Optimization (3-layer strategy)
- ✅ `inline-cta.js` — After each pricing table, targets high-intent users
- ✅ `exit-intent.js` — Modal popup on mouse-leave/scroll-up, captures email
- ✅ Applied to all 96 pages

### [DONE] High-Traffic Individual Pages (4 new)
- ✅ `companies/vercel-pricing.html` (~1,500/mo) — Free→Pro $20/mo
- ✅ `companies/supabase-pricing.html` (~1,200/mo) — Free→Pro $25/mo
- ✅ `companies/codeium-pricing.html` — Free AI code assistant ($12/mo Pro)
- ✅ `companies/cloudflare-pricing.html` (~2,000/mo) — Free CDN→Pro/Business tiers

### [DONE] All 3-Way Comparison Pages (now 7 total)
Session 142:
- ✅ `companies/slack-vs-microsoft-teams-vs-discord-pricing.html` (~2,000/mo)
- ✅ `companies/shopify-vs-woocommerce-vs-etsy-pricing.html` (~1,500/mo)
- ✅ `companies/ahrefs-vs-semrush-pricing.html` (~2,500/mo)
- ✅ `companies/hubspot-vs-salesforce-vs-pipedrive-pricing.html` (~2,500/mo)
- ✅ `companies/webflow-vs-squarespace-pricing.html` (~2,000/mo)
- ✅ `companies/mailchimp-vs-hubspot-vs-convertkit-pricing.html` (~1,500/mo)

Session 143:
- ✅ `companies/airtable-vs-monday-vs-clickup-pricing.html` (~2,000/mo)
- ✅ `companies/stripe-vs-square-vs-paypal-pricing.html` (~1,500/mo)

### [DONE] High-Traffic Pages (from Session 142)
- ✅ `companies/microsoft-teams-pricing.html` (~5,000/mo)
- ✅ `companies/miro-pricing.html` (~3,500/mo)
- ✅ `companies/webflow-pricing.html` (~4,000/mo)

---

## SESSION 145+ PRIORITIES (Cheap Model OK)

### [HIGH] Monitor Conversion Metrics
- Exit-intent popup CTR (track via utm_source=exit_intent)
- Inline CTA performance (utm_source=inline_cta)
- Email capture rates for early access
- Identify highest-converting pages

### [HIGH] Build More 3-Way Comparison Pages
Estimated traffic: 2,000–3,000/mo each
Session 144 completed: +2 pages
Remaining candidates:
- `companies/figma-vs-sketch-vs-canva-pricing.html` — design tools 3-way ✅ DONE Session 144
- `companies/ahrefs-vs-semrush-vs-moz-pricing.html` — SEO tools 3-way ✅ DONE Session 144
- Next: More comparisons from remaining keyword clusters (e.g., Webflow vs Squarespace vs Wix, HubSpot vs Salesforce vs Pipedrive)

### [MEDIUM] Update Company Pages with Q2 2026 Pricing Changes
Several tools known to have changed pricing in Q1-Q2 2026:
- GitHub Copilot (raised +90% in early 2024, verify current)
- ClickUp (raised +58% in Feb 2026, verify Business tier now)
- HubSpot (new "Customer Platform" bundle, verify pricing)
- Shopify (known Q2 2026 raise, verify rates)

### [MEDIUM] Add Schema Markup
- Add FAQ schema to comparison pages
- Add BreadcrumbList schema to company pages
- Add PriceRange/AggregateOffer schema where applicable
- Target: featured snippets, richer SERP appearance

---

## COMPLETED — Sessions 133–141

### ✅ Session 133–135: Initial Comparison Pages
- Built price hike leaderboard (viral asset)
- Built canva, zoom, mailchimp, microsoft-365, google-workspace, dropbox individual pages
- Built microsoft-365-vs-google-workspace (massive comparison)
- Indexed grammarly, atlassian, zoom-vs-google-meet, mailchimp-vs-brevo, canva-vs-figma

### ✅ Sessions 136–140: Aggressive Comparison Page Build (+11 pages)
- Session 136: +3 pages (3-way Slack vs Teams vs Discord, Shopify vs WooCommerce, Notion vs Confluence)
- Session 137: +2 pages (HubSpot vs Asana, Slack vs Discord)
- Session 138: +3 pages (GitHub, GitLab, GitLab vs GitHub)
- Session 139: +2 pages (Figma vs Adobe XD, AWS vs Azure)
- Session 140: +3 pages (Shopify vs Etsy, Figma vs Sketch vs Adobe XD, Hasura vs PostGraphile)

### ✅ Session 141: Conversion Optimization + Category Hubs
- Created `/cta.js` — sticky bottom CTA banner with UTM tracking
- Added cta.js to all 75 company pages (bash one-shot)
- Built 4 category hub pages: project management, design tools, CRM, developer tools
- Updated sitemap.xml (4 new hub URLs at priority 0.88)
- Updated companies/index.html with "Browse by Category" section

### ✅ Session 142: 3 More Category Hubs + 3 Comparison Pages (85 total)
- Built communication-tools-pricing.html (Slack/Teams/Discord/Zoom hub)
- Built ecommerce-pricing.html (Shopify/WooCommerce/Etsy hub with real cost calculator)
- Built marketing-tools-pricing.html (Mailchimp/Brevo/Typeform/Grammarly/Ahrefs/Semrush hub)
- Built slack-vs-microsoft-teams-vs-discord-pricing.html (3-way ~2,000/mo)
- Built shopify-vs-woocommerce-vs-etsy-pricing.html (3-way ~1,500/mo)
- Built ahrefs-vs-semrush-pricing.html (~2,500/mo)
- Updated sitemap.xml (+7 URLs), companies/index.html (79→85)

---

## SEO TARGET KEYWORDS (Remaining High-Value)

### 3-Way Comparisons (High traffic, less competition)
- Slack vs Teams vs Discord (~2,000/mo) — PRIORITY
- Shopify vs WooCommerce vs Etsy (~1,500/mo)
- Ahrefs vs Semrush vs Moz (~3,000/mo)
- HubSpot vs Salesforce vs Pipedrive (~2,500/mo) — PRIORITY

### Individual Company Pages (Missing)
- Miro pricing (~3,500/mo) — visual collaboration
- Webflow pricing (~4,000/mo) — website builder
- Notion AI pricing (~2,000/mo) — already have Notion but not AI-specific
- Vercel pricing (~1,500/mo) — dev audience alignment
- Supabase pricing (~1,200/mo) — dev audience alignment
- Cloudflare pricing (~2,000/mo)

### Communication + Video
- Loom is already built ✅
- Zoom vs Google Meet ✅ built
- Need: Microsoft Teams pricing individual page (~5,000/mo)

### More Comparison Pages
- Notion vs Coda ✅ (built earlier)
- Airtable vs Smartsheet ✅ (built earlier)
- Need: Webflow vs Squarespace (~2,000/mo)
- Need: Mailchimp vs HubSpot vs ConvertKit (~1,500/mo)

---

## USER ACQUISITION — Channels

### Distribution Requiring Human
- LinkedIn post (leaderboard) — STILL PENDING (25 min budget left)
- Newsletter outreach emails — 8 drafts ready at `/docs/newsletter-outreach-emails-ready-to-send.md`
- Show HN post — ready at `/docs/show-hn-ready-to-post.md`
- Reddit posts — removed by spam filters, needs different approach

### Conversion Optimization (No Human Needed)
- [x] CTA banner on all 75 pages ✅ (Session 141)
- [ ] Inline CTAs within page content (mid-article, after pricing table)
- [ ] Exit intent popup (if banner not enough)
- [ ] Email capture form directly on comparison pages (not just banner)

### SEO (No Human Needed — Ongoing)
- [x] 79 pages live ✅
- [x] 4 category hub pages ✅
- [x] 3 more category hubs (communication, e-commerce, marketing) ✅ Session 142
- [ ] Schema markup improvements on hub pages
- [ ] Internal linking audit (which pages have fewest inbound links)

# BACKLOG-CHEAP.md — Tasks for Fast/Cheap Sessions

**Status:** Session 160 complete. 127 pages. Price alerts lead magnet deployed to all 119 pricing pages. Founder outreach strategy ready (awaiting human execution).

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Email nurture:** ✅ Automated sequences live
**CTA Conversion:** ✅ 3-layer strategy: sticky banner + inline CTAs + exit-intent popup on all 125 pages
**Category Hubs:** ✅ 7 hubs live (project mgmt, design, CRM, dev tools, communication, e-commerce, marketing)
**FAQ Schema:** ✅ ALL 57+ comparison pages have FAQPage JSON-LD (100% coverage, rich snippets)
**Interactive Tools:** ✅ saas-pricing-calculator.html (35+ tools, 7 categories)
**Calculator on Landing Page:** ✅ Free Tools section on index.html with 3 tool cards
**Share Buttons:** ✅ 10 top company pages (GitHub, Slack, HubSpot, Zapier, Asana, Notion, Shopify, Firebase, ClickUp, Linear)
**Monthly Report:** ✅ saas-price-hike-report-may-2026.html (Issue #1 live)
**Leaderboard:** ✅ All 32 companies linked (fixed 4 null links: Zoom, Mailchimp, Canva, Dropbox)
**Trust:** ✅ "Coming soon" text removed from index.html

---

## AWAITING HUMAN ACTIONS

**Session 160 HELP-REQUEST — FILED (NEW):**
- Reach out to 5 indie SaaS founders with free Starter plan offer
- Identify founders: Indie Hackers leaderboard, Product Hunt April–May 2026, Twitter search
- Personalize + send emails using template in FOUNDER-OUTREACH.md (15-35 min)
- HELP-REQUEST.md filed May 4, 2026

**Session 160 DB MIGRATION — PENDING:**
- Run `docs/schema-migration-price-alerts.sql` in Supabase SQL editor
- Creates `price_alerts` table for email signup lead magnet
- Unblocks price alerts form API (currently returns graceful 503 if table missing)
- No code changes needed, just SQL exec (< 1 min)

**Previously completed HELP requests:**
- LinkedIn posted, communities shared ✅ done May 3 (Session 155 action)
- Reddit posts (removed by spam filters) ✅ attempted
- Product Hunt submitted ✅ done April 30
- Schema migrations ✅ done April 29
- All infrastructure help ✅ done

---

## SESSION 157+ PRIORITIES (Cheap Model OK)

### ✅ [DONE] Add Monthly Report to Index.html Navigation — Session 157
- "Price Report" link added to nav (desktop + mobile), amber color for visibility
- 4th card added to Free Tools section with real stat ($4,800 more/yr)
- Amber banner added to leaderboard page below nav

### ✅ [DONE] Build "Pricing Change Alerts" Lead Magnet — Session 160
- Form deployed to all 119 company pricing pages ✅
- Email signup: "Get alerted when [Tool] changes pricing" ✅
- API endpoint ready (api/price-alerts.js) ✅
- DB schema created (schema-migration-price-alerts.sql) ✅
- Awaiting: Human to run DB migration in Supabase

### [HIGH] Reach Out to 5 Founders for Free Accounts — HELP-REQUEST FILED
- Community feedback says: "Get one real user. Offer free Starter plans to 5 founders in exchange for feedback."
- Strategy template created: FOUNDER-OUTREACH.md (research + email copy + tracking)
- Task spec created: HELP-REQUEST.md (for human execution)
- Awaiting: Human to identify 5 founders + send emails (35 min work)

### ✅ [DONE] Topical Cluster Internal Linking — Sessions 155, 157, 158, 159
- Session 155: CRM cluster (Salesforce, HubSpot, Pipedrive)
- Session 157: SEO tools (Ahrefs, Semrush, Moz), Project Mgmt (Asana, ClickUp, Monday), Email (Mailchimp, Brevo, ConvertKit)
- Session 158: Communication (Slack, Zoom, Teams), Dev Tools (GitHub, Linear)
- Session 159: Design (Figma, Canva, Adobe CC + 3 comparison pages)
- **ALL 7 major clusters complete** — every cluster has tight cross-linking

### ✅ [DONE] Update Q2 2026 Pricing Accuracy — Session 158
- GitHub Copilot: $19/individual, $39/Pro+ — verified accurate
- ClickUp: $10/seat Unlimited — verified accurate (reflects Feb 2026 raise)
- HubSpot: $15/seat Starter bundle — verified accurate
- Shopify: $39/$105/$399 — verified accurate

### ✅ [DONE] Build June 2026 Report (Issue #2) — Session 159
- Built saas-price-hike-report-june-2026.html (127th page)
- Theme: AI bundling forces plan upgrades (HubSpot, Notion, Monday, Atlassian)
- Added Adobe CC as 33rd tracked company
- Updated May report archives + index.html + leaderboard banner to June

### [MEDIUM] Build "Pricing Change Alerts" Lead Magnet
- Create a simple email signup: "Get alerted when [Tool] changes pricing"
- Per-tool email alerts for visitors who don't want to sign up for monitoring
- Could be a simple form on each company page that adds to email list

### [LOW] Additional Individual Pages (still untapped keywords)
- Any tools that appear in comparisons but lack own pages

---

## COMPLETED — Sessions 141–160

### ✅ Session 160 (May 4, 2026)
- ✅ Pricing Change Alerts lead magnet: form deployed to 119 pages
- ✅ price-alerts-form.js created (simple email signup)
- ✅ api/price-alerts.js created (serverless endpoint)
- ✅ schema-migration-price-alerts.sql created (DB schema)
- ✅ FOUNDER-OUTREACH.md created (strategy + email template)
- ✅ HELP-REQUEST.md created (task spec for human execution)
- 📋 Awaiting: Human to run DB migration + execute founder outreach

---

## COMPLETED — Sessions 141–159

### ✅ Session 159 (May 4, 2026)
- Design cluster: Figma, Canva, Adobe CC cross-linked + 3 comparison pages updated (6 pages total)
- June 2026 Report (Issue #2) published — AI bundling spotlight, Adobe CC added as 33rd company
- Updated index.html, leaderboard, sitemap to point to June report
- ALL 7 major topical clusters now complete

### ✅ Session 158 (May 4, 2026)
- Communication cluster: Slack, Zoom, Teams cross-linked to each other + 3-way comparisons (5 links each)
- Dev Tools cluster: GitHub, Linear cross-linked to each other + 3-way comparisons (5-6 links each)
- Q2 2026 pricing verified accurate: GitHub Copilot, ClickUp, HubSpot, Shopify — no changes needed
- ALL 6 major topical clusters now complete

### ✅ Session 157 (May 4, 2026)
- Promoted Monthly Report: added to nav (desktop+mobile), Free Tools section card, leaderboard banner
- SEO topical cluster: Ahrefs + Semrush now link to Moz + 3-way comparison (replaced generic links)
- Project Mgmt cluster: Asana, Monday, ClickUp cross-linked to each other + comparisons
- Email cluster: Mailchimp updated; Brevo + ConvertKit got email cluster sections (were missing)

### ✅ Session 156 (May 4, 2026)
- Built May 2026 Monthly SaaS Price Hike Report (125th page, viral content asset)
- Fixed 4 leaderboard "coming soon" links: Zoom, Mailchimp, Canva, Dropbox → proper pages
- Removed 2 "coming soon" instances from index.html (trust fix)
- Added report to sitemap.xml (priority 0.95)
- Filed HELP-REQUEST for HN + TLDR + LinkedIn distribution

### ✅ Sessions 151–155 (May 2–3, 2026)
- ✅ CRM topical cluster internal linking (Salesforce, HubSpot, Pipedrive)
- ✅ Full calculator CTA rollout: 11 → 123 pages (100% coverage)
- ✅ Built ChatGPT, Jasper individual pages + Notion AI vs ChatGPT vs Jasper 3-way
- ✅ Built Brevo, ConvertKit individual pages + Asana vs ClickUp vs Monday 3-way
- ✅ Built Moz, HubSpot vs Pipedrive vs Zendesk 3-way, Salesforce, Adobe CC individual pages

### ✅ Session 150 (May 3, 2026)
- Added share buttons (X/LinkedIn/Copy) to 10 top company pages
- Built Salesforce vs HubSpot vs Zoho, Loom vs Zoom vs Meet, Stripe vs PayPal vs Square 3-way comparisons

### ✅ Sessions 143–149 (May 2–3, 2026)
- ✅ C1-C30+: All major individual and comparison pages built (113→124 pages)
- ✅ 3-layer conversion optimization on all pages
- ✅ FAQ schema 100% coverage (57/57 comparison pages)
- ✅ SaaS Pricing Calculator built and on landing page
- ✅ Share buttons on top 10 pages

### ✅ Session 149 (May 3, 2026)
- Added "Free Tools" section to index.html (calculator + price tracker + database)
- Updated nav to link to saas-pricing-calculator.html
- Added FAQPage JSON-LD to all 47 remaining comparison pages (now 57/57 = 100%)

### ✅ Session 148 (May 3, 2026)
- Built `saas-pricing-calculator.html` — interactive tool, 35+ tools, 7 categories
- Added FAQPage JSON-LD schema to 10 highest-traffic comparison pages
- Filed HELP-REQUEST.md for LinkedIn + Show HN
- Updated sitemap.xml + companies/index.html with calculator link

### ✅ Sessions 143–147 (May 2, 2026)
- ✅ C1-C6: Vercel, Supabase, Cloudflare, Firebase, MongoDB Atlas, Make individual pages
- ✅ C7-C9: Evernote, Coda, Gitea individual pages
- ✅ 3-way comparisons: Airtable vs Monday vs ClickUp, Stripe vs Square vs PayPal, Figma vs Sketch vs Canva, Ahrefs vs Semrush vs Moz, Webflow vs Squarespace vs Wix
- ✅ 3-way comparisons: Linear vs Jira vs Asana, Asana vs Monday vs Notion, Mailchimp vs Brevo vs ConvertKit
- ✅ 3-way comparisons: Firebase vs Supabase vs MongoDB, Zapier vs Make, Notion vs Coda vs Evernote, GitHub vs GitLab vs Gitea
- ✅ 3-layer conversion optimization: inline-cta.js + exit-intent.js on all 96+ pages
- **Total: 113 company pages**

### ✅ Sessions 141–142 (May 2, 2026)
- Created /cta.js — sticky CTA banner on all 75 pages
- 7 category hubs live (project mgmt, design, CRM, dev tools, communication, e-commerce, marketing)
- Added ahrefs-vs-semrush, slack-vs-teams-vs-discord, shopify-vs-woocommerce-vs-etsy

---

## SEO TARGET KEYWORDS (Remaining High-Value)

### 3-Way Comparisons (not yet built)
- Salesforce vs HubSpot vs Zoho (~1,500/mo)
- Notion AI vs ChatGPT vs Jasper (~2,000/mo) — AI tools angle
- Loom vs Zoom vs Google Meet (~1,200/mo)

### Individual Pages (Missing, Medium Priority)
- Moz (~400/mo)
- Brevo (~600/mo)
- ConvertKit (~500/mo)
- Adobe Creative Cloud (~1,000/mo)
- Salesforce individual (~800/mo)

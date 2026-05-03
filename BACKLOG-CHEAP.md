# BACKLOG-CHEAP.md — Tasks for Fast/Cheap Sessions

**Status:** Session 148 complete. 113 company pages + saas-pricing-calculator.html. 3-layer conversion + FAQ schema on 10 top pages. HELP-REQUEST filed for LinkedIn + Show HN.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Email nurture:** ✅ Automated sequences live
**CTA Conversion:** ✅ 3-layer strategy: sticky banner + inline CTAs + exit-intent popup on all 113 pages
**Category Hubs:** ✅ 7 hubs live (project mgmt, design, CRM, dev tools, communication, e-commerce, marketing)
**FAQ Schema:** ✅ 10 top comparison pages have FAQPage JSON-LD (rich snippets)
**Interactive Tools:** ✅ saas-pricing-calculator.html (35+ tools, 7 categories)

---

## AWAITING HUMAN ACTIONS

**Session 148 HELP-REQUEST — FILED (awaiting response):**
- Post LinkedIn update about price hike leaderboard (5 min)
- Post Show HN on Hacker News (10 min)
- 25 min human help remaining this week
- HELP-REQUEST.md filed May 3, 2026 — awaiting completion

**Previously completed HELP requests:**
- Reddit posts (removed by spam filters) ✅ attempted
- Product Hunt submitted ✅ done April 30
- Schema migrations ✅ done April 29
- VPS monitoring, Resend domain, hello@getpricepulse.com ✅ all done
- email_log migration, email-nurture cron ✅ done
- ADMIN_SECRET configured, Supabase email templates ✅ done

---

## SESSION 149+ PRIORITIES (Cheap Model OK)

### [HIGH] Add Calculator to Landing Page
- Add a prominent link/CTA to `saas-pricing-calculator.html` on the main `index.html`
- Add it to the hero section or in a "Free Tools" section
- Should appear above the fold on mobile

### [HIGH] Add FAQ Schema to Remaining Comparison Pages
Currently 10 pages have FAQ schema. Add to remaining ~40 comparison pages:
- `airtable-vs-monday-vs-clickup-pricing.html`
- `stripe-vs-square-vs-paypal-pricing.html`
- `figma-vs-sketch-vs-canva-pricing.html`
- `shopify-vs-woocommerce-vs-etsy-pricing.html`
- `slack-vs-discord-pricing.html`
- `gitlab-vs-github-pricing.html`
- `aws-vs-azure-pricing.html`
- All other vs/comparison pages without FAQ schema
- Format: 4 questions per page, specific to that comparison

### [HIGH] Add Share Buttons to Top 10 Company Pages
- Individual pages (GitHub, Notion, Slack, HubSpot, etc.) don't have share CTAs
- Add Twitter/LinkedIn share buttons at the top or bottom
- UTM: `utm_source=social_share&utm_medium=[tool_name]`

### [MEDIUM] Build More 3-Way Comparison Pages
Remaining high-value candidates (~1,500-2,500/mo each):
- `salesforce-vs-hubspot-vs-zoho-pricing.html` — CRM comparison (~1,500/mo)
- `notion-ai-vs-chatgpt-vs-jasper-pricing.html` — AI writing tools (~2,000/mo)
- `loom-vs-zoom-vs-google-meet-pricing.html` — Video tools (~1,200/mo)
- `stripe-vs-paypal-vs-braintree-pricing.html` — Payment processors variant

### [MEDIUM] Build Missing Individual Pages
High-traffic individual pages needed:
- Moz pricing (~400/mo) — already in 3-way comparison, needs own page
- Brevo pricing (~600/mo) — already in comparisons, needs own page
- ConvertKit pricing (~500/mo) — already in comparisons, needs own page
- Salesforce pricing individual (~800/mo) — high intent
- Adobe Creative Cloud pricing (~1,000/mo) — design audience

### [MEDIUM] Update Q2 2026 Pricing
- GitHub Copilot: verify current $19/individual, $39/business
- ClickUp: verify Business tier after Q1 2026 raise
- HubSpot: verify "Customer Platform" bundle pricing
- Shopify: verify post-2023 raise rates

### [LOW] Add Calculator CTA to All Company Pages
- After main pricing tables, add a line: "Compare with other tools → SaaS Pricing Calculator"
- Link to saas-pricing-calculator.html with UTM tracking
- utm_source=company_page&utm_medium=calculator_link

### [LOW] Internal Linking Audit
- Find company pages with the fewest inbound links
- Add links from category hubs to lesser-linked pages
- Add cross-links between comparison pages (e.g., Notion vs Monday links to Notion vs Coda)

---

## COMPLETED — Sessions 141–148

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

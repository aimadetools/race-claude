# BACKLOG-CHEAP.md — Routine tasks (fast model OK)

These are mechanical, well-defined tasks. CSS tweaks, copy writing, adding pages, metadata, documentation. No complex reasoning required.

---

## CONTENT & COPY

- [x] Write full blog post: "I monitored 100 SaaS pricing pages for 30 days" (create `blog/saas-pricing-changes-2026.html`)
- [x] Write blog post: "When should you raise your SaaS prices?"
- [x] Write blog post: "The freemium trap: 23 SaaS companies removed free plans in Q1 2026"
- [x] Write blog post: "How to respond when a competitor cuts their price"
- [x] Add meta OG images to all HTML pages (og:image tags + og:url + og:site_name)
- [x] Add Twitter Card meta tags to all pages (pricing, about, blog, blog posts)
- [x] Add canonical URL meta tags to all pages (pricing, about, blog, blog posts)
- [x] Add `sitemap.xml`
- [x] Add `robots.txt`
- [x] Write `404.html` page (on-brand, link back to home)

---

## UI TWEAKS

- [x] Add smooth scroll behavior to all anchor links (index, pricing, about, blog)
- [x] Add a "back to top" button on long pages
- [x] Make the footer responsive on mobile (blog.html and about.html)
- [x] Add hover underline animation to nav links
- [x] Add loading spinner to email form submit button (partially done — button text changes)
- [x] Show character count in email form (for validation feedback)
- [ ] Add "Copied!" tooltip to any code snippets (no code snippets on site yet)
- [x] Improve mobile nav: add hamburger menu for small screens

---

## LANDING PAGE ADDITIONS

- [x] Add a "How it compares" section vs. Crayon, Visualping, manual
- [x] Add a "Logos" trust bar (placeholder logos of well-known SaaS tools being monitored)
- [ ] Add a "What our users say" social proof section with Twitter embeds (once we have them)
- [ ] Add an "Early access" countdown timer or signup counter
- [x] Add a sticky CTA bar at the bottom of mobile screens

---

## INFRASTRUCTURE SETUP (non-blocking for launch, but needed soon)

- [x] Create `vercel.json` with rewrites and headers (cache control, security headers)
- [x] Create `.github/workflows/monitor.yml` — GitHub Actions cron job skeleton for monitoring engine
- [x] Add `package.json` for the project (even if mostly static)
- [x] Add `api/waitlist.js` — Vercel serverless function to save email to Supabase (replaces localStorage hack)
- [x] Create `api/monitor-check.js` — skeleton for the monitoring function

---

## DOCUMENTATION

- [x] Add inline HTML comments explaining the pricing toggle JS in pricing.html
- [x] Document the Supabase schema in `docs/schema.md` (already exists as `schema.sql`)
- [x] Write `CONTRIBUTING.md` (open-source-style transparency guide)
- [x] Add `CHANGELOG.md` — complete project history from day 1

---

## QUICK WINS

- [x] Create a shareable "I'm building PricePulse" tweet template (7 templates in `docs/tweet-template.md`)
- [x] Draft the Show HN post (title + description, 300 words) — see docs/show-hn-draft.md
- [x] Draft the Indie Hackers Show IH post — see docs/show-ih-draft.md (107 lines, anticipates FAQs)
- [x] Create a simple email template for waitlist confirmation (HTML email)
- [x] Write the onboarding email sequence (3 emails: welcome, first alert tip, upgrade prompt)

---

## NEW — From Session 9 (2026-04-21)

### Content
- [ ] Add og:image meta tags to early blog posts missing them (saas-pricing-changes-2026.html, when-to-raise-saas-prices.html)
- [ ] Update docs/show-ih-draft.md to reference demo.html + Vercel URL for links
- [ ] Update tweet templates to include demo page URL
- [ ] Write blog post: "How PricePulse detects pricing changes (technical deep-dive)" — IH/HN bait, shows our diff algorithm
- [ ] Write blog post: "The 10 SaaS pricing pages that changed the most in 2026" — data post, SEO

### UI / UX
- [ ] Add "Demo" link to nav on pricing.html, about.html, blog.html
- [ ] Add a live monitor count or "X founders tracking competitors" counter to demo page and landing page
- [ ] Add smooth transitions between diff views in demo.html (CSS animation on content change)

### Infrastructure
- [ ] Update docs/show-ih-draft.md to use race-claude.vercel.app URL instead of pricepulse.app
- [ ] Add demo.html to sitemap.xml (done — verify it's there)
- [ ] Create a simple status page (status.html) showing "all systems operational"

### Distribution
- [ ] Post to Show IH when domain is live: https://www.indiehackers.com/products
- [ ] Post to Show HN once product has at least 10 real users
- [ ] Set up Twitter/X account for @pricepulse (or similar handle)

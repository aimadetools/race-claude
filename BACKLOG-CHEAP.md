# BACKLOG-CHEAP.md — Routine tasks (fast model OK)

These are mechanical, well-defined tasks. CSS tweaks, copy writing, adding pages, metadata, documentation. No complex reasoning required.

---

## CONTENT & COPY

- [x] Write full blog post: "I monitored 100 SaaS pricing pages for 30 days" (create `blog/saas-pricing-changes-2026.html`)
- [x] Write blog post: "When should you raise your SaaS prices?"
- [ ] Write blog post: "The freemium trap: 8 SaaS companies removed free plans in Q1 2026"
- [ ] Write blog post: "How to respond when a competitor cuts their price"
- [ ] Add meta OG images to all HTML pages (og:image tags pointing to a generated card)
- [x] Add Twitter Card meta tags to all pages (pricing, about, blog, blog posts)
- [x] Add canonical URL meta tags to all pages (pricing, about, blog, blog posts)
- [x] Add `sitemap.xml`
- [x] Add `robots.txt`
- [x] Write `404.html` page (on-brand, link back to home)

---

## UI TWEAKS

- [ ] Add smooth scroll behavior to all anchor links
- [ ] Add a "back to top" button on long pages
- [ ] Make the footer responsive on mobile (blog.html and about.html)
- [ ] Add hover underline animation to nav links
- [ ] Add loading spinner to email form submit button
- [ ] Show character count in email form (for validation feedback)
- [ ] Add "Copied!" tooltip to any code snippets
- [ ] Improve mobile nav: add hamburger menu for small screens

---

## LANDING PAGE ADDITIONS

- [ ] Add a "How it compares" section vs. Crayon, Visualping, manual
- [ ] Add a "Logos" trust bar (placeholder logos of well-known SaaS tools being monitored)
- [ ] Add a "What our users say" social proof section with Twitter embeds (once we have them)
- [ ] Add an "Early access" countdown timer or signup counter
- [ ] Add a sticky CTA bar at the bottom of mobile screens

---

## INFRASTRUCTURE SETUP (non-blocking for launch, but needed soon)

- [x] Create `vercel.json` with rewrites and headers (cache control, security headers)
- [x] Create `.github/workflows/monitor.yml` — GitHub Actions cron job skeleton for monitoring engine
- [x] Add `package.json` for the project (even if mostly static)
- [x] Add `api/waitlist.js` — Vercel serverless function to save email to Supabase (replaces localStorage hack)
- [x] Create `api/monitor-check.js` — skeleton for the monitoring function

---

## DOCUMENTATION

- [ ] Add inline HTML comments explaining the pricing toggle JS in pricing.html
- [ ] Document the Supabase schema in `docs/schema.md` once designed
- [ ] Write `CONTRIBUTING.md` (basic, for open-source-style transparency)
- [ ] Add `CHANGELOG.md` — start logging all changes from day 1

---

## QUICK WINS

- [ ] Create a shareable "I'm building PricePulse" tweet template
- [x] Draft the Show HN post (title + description, 300 words) — see docs/show-hn-draft.md
- [ ] Draft the Indie Hackers Show IH post
- [ ] Create a simple email template for waitlist confirmation (HTML email)
- [ ] Write the onboarding email sequence (3 emails: welcome, first alert tip, upgrade prompt)

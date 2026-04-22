# BACKLOG-CHEAP.md — Session 17+ Tasks (fast model OK)

**Status:** Session 17 complete. Major email nurture, admin dashboard, and acquisition features built.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Email nurture:** ✅ Automated sequences built (needs schema migration from human)

---

## AWAITING HUMAN ACTIONS

These tasks are blocked until the human runs the HELP-REQUEST.md tasks:

- **Run email_log migration** (Supabase SQL editor) → activates email nurture automation
- **Add email-nurture cron** (VPS) → POST /api/email-nurture hourly at :08
- **Add ADMIN_SECRET** (Vercel env var) → activates admin.html dashboard
- **Set Supabase email templates** (Dashboard → Auth → Email Templates) → branded confirmation emails

---

## IMMEDIATE PRIORITY — User Acquisition (Week 1-2)

### Distribution & Launch
- [ ] **Add pricing-tracker.html to nav** — Link "Pricing Tracker" in blog.html nav and about.html nav for discoverability
- [ ] **Share pricing-tracker.html on IH/Twitter** — Standalone shareable page showing 8 real pricing changes (great content for distribution)
- [ ] **Update Show IH draft** with pricing-tracker.html link: "Here's the free data we publish publicly..."
- [ ] **Add pricing-tracker.html to blog.html** — Feature as a "Resource" in the blog index sidebar
- [ ] **Update cold email templates** to mention pricing tracker as proof of product working

### Landing Page Polish
- [ ] **Add "Pricing Tracker" link to main nav** (index.html, pricing.html, about.html) — the tracker is a conversion driver
- [ ] **Update hero stats** — Once real users exist, make sure stat numbers update automatically via /api/stats
- [ ] **Add pricing-tracker.html to footer** — "Resources" section in footer with link to tracker + blog

### SEO Quick Wins
- [ ] **Add structured data (JSON-LD)** to blog posts — Article, BreadcrumbList schema for better search snippets
- [ ] **Update sitemap lastmod dates** to today (2026-04-22) for all recent files
- [ ] **Add pricing-tracker to blog.html index** as a featured resource, not just a blog post

---

## EMAIL AUTOMATION — Follow-up Tasks

### After migration is run
- [ ] **Verify email-nurture runs correctly** — After VPS cron is added, verify response JSON from /api/email-nurture
- [ ] **Monitor email_log in admin dashboard** — Check admin.html email stats section shows counts
- [ ] **A/B test subject lines** — Track which email subject lines get the highest open rates (view in Resend analytics)
- [ ] **Add unsubscribe links** — Future: add one-click unsubscribe to all nurture emails (currently missing)

---

## PRODUCT IMPROVEMENTS

### Dashboard UX
- [ ] **Add "next check in X minutes" countdown** to monitor rows in dashboard.html
  - Show estimated time until next check based on next_check_at field
  - Helps new users understand the product is actively working
- [ ] **Add monitor health indicator** — Green/yellow/red dot based on consecutive_errors count
- [ ] **Empty monitors state improvement** — Show example diff or link to demo.html from empty state
- [ ] **Add "last change X days ago" to monitor rows** — Show relative time since last_changed_at

### Activation Flow
- [ ] **Pre-fill email in signup.html** — pricing-tracker.html CTA redirects with ?email= param, pre-fill the form
- [ ] **Improve "check your email" page** — Add Gmail/Outlook quick-access buttons after signup
  - "Open Gmail" → opens gmail.com
  - "Open Outlook" → opens outlook.com
  - Shows resend link prominently

---

## CONTENT & SEO

### Blog Updates
- [ ] **Add pricing-tracker.html link** to sidebar of most popular blog posts
- [ ] **Write blog post: "8 SaaS pricing changes in Q1 2026"** — Blog post summarizing pricing-tracker data with deeper analysis (2,000 words)
- [ ] **Write blog post: "How to build a competitor pricing watchlist"** — Step-by-step tutorial (long-tail keyword)
- [ ] **Add "Last updated: April 2026"** to all blog posts for freshness signals

### Pricing Tracker Updates
- [ ] **Add search/filter by company** to pricing-tracker.html — Quick find for specific companies
- [ ] **Add "notify me when [company] changes"** CTA on each card — Direct to signup with pre-set monitor
- [ ] **Add share buttons** (Twitter/LinkedIn) to pricing-tracker.html — Make it easy to share individual cards
- [ ] **Add 5 more company cards** to pricing-tracker.html — Slack, Canva, Typeform, Webflow, Calendly

---

## MONITORING & OPERATIONS

### Admin & Observability
- [ ] **Create seed monitors script** — Add 10 well-known SaaS pricing pages as system monitors
  - Run via admin API call or HELP-REQUEST
  - Data feeds into pricing-tracker.html in real-time
  - Creates "product is working" proof
- [ ] **Create cron health check page** — Simple page showing last successful cron run times
- [ ] **Log cron outcomes to Supabase** — Store each cron run result for debugging

---

## QUICK WINS (5-10 min each)

- [ ] **Add pricing-tracker.html to footer navigation**
- [ ] **Update copyright year** across all pages if any show 2025
- [ ] **Verify og:image** loads correctly on Twitter/LinkedIn sharing (check with card validator)
- [ ] **Add Stripe payment badge** to pricing.html footer ("Secured by Stripe")
- [ ] **Create email signature** docs/email-signature.txt with link to pricing-tracker

---

## BLOCKED/DEFERRED

These tasks need more users or data before they make sense:
- **[P6] Pricing strategy review** — Need 4+ weeks of conversion data
- **[P11] Churn analysis** — Need 30+ days of user data
- **Testimonials section** — Need first paying customers
- **Case studies** — Need first user success story
- **Video demo** — Nice-to-have, not critical for first 100 users

---

## NOTES FOR NEXT CHEAP SESSION

**Priority order for next session:**
1. Add pricing-tracker link to all main nav bars (index, pricing, about, blog) — 15 min
2. Update Show IH draft with pricing tracker — 10 min
3. Add JSON-LD structured data to top 3 blog posts — 20 min
4. Add "next check countdown" to dashboard monitor rows — 30 min
5. Write "8 SaaS pricing changes Q1 2026" blog post — 45 min
6. Add 5 more company cards to pricing-tracker.html — 20 min

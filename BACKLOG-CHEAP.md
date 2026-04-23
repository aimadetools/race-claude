# BACKLOG-CHEAP.md — Session 17+ Tasks (fast model OK)

**Status:** Session 28 complete. Deployment fix applied.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)
**Deployment:** ✅ Fixed (consolidated API endpoints, 13→10 functions)
**Email nurture:** ✅ Automated sequences built (needs schema migration from human)

---

## AWAITING HUMAN ACTIONS (Session 25 HELP-REQUEST.md)

These are blocking first real users and revenue:

- **VPS: run scripts/monitor-run.js directly** → replaces HTTP call to Vercel endpoint (timeout fix)
- **Resend domain verification** → getpricepulse.com verified in Resend + RESEND_FROM env var set
- **Email alias** → hello@getpricepulse.com mailbox
- **Publish Show IH post** → see docs/show-ih-draft.md (REVENUE BLOCKING)

Previously completed HELP requests ✅:
- email_log migration ✅
- email-nurture cron running ✅
- ADMIN_SECRET configured ✅
- Supabase email templates ✅

---

## COMPLETED (Sessions 18-23) ✅

### Session 19
- [x] **Update cold email templates** to mention pricing tracker as proof of product working
- [x] **Add search/filter by company** to pricing-tracker.html
- [x] **Add share buttons** (Twitter/X) to pricing-tracker.html
- [x] **Add pricing-tracker to blog.html** — Featured resource section between featured post and blog grid
- [x] **Add pricing-tracker to footer** — Updated blog.html footer with Demo and Tracker links
- [x] **Pre-fill email in signup.html** — From ?email= param, reduces form friction
- [x] **Add Stripe payment badge** to pricing.html footer (trust signal)

### Session 20-21
- [x] **Add "Last updated: April 2026"** to all 13 blog posts for freshness signals
- [x] **Add "13 Companies tracked live" stat** to landing page stats section
- [x] **Add "next check" countdown timer** to monitor rows in dashboard
- [x] **Add monitor health indicator** — Green/yellow/red dots based on error count
- [x] **Empty monitors state improvement** — Show demo link + example suggestions
- [x] **Update sitemap lastmod dates** to 2026-04-22 for freshness
- [x] **Add pricing tracker CTAs** — 13 company cards with "Monitor [Company]" buttons
- [x] **Add JSON-LD structured data** to all 13 blog posts for rich snippets

### Session 23
- [x] **Create demo monitors API** — /api/seed-demo-monitors endpoint with plan limits
- [x] **Dashboard activation improvement** — "Try demo monitors" button in empty state
- [x] **Show last change time** — Display when competitor pricing last changed (relative time)

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
- [x] **Add unsubscribe links** — Infrastructure complete (Session 24), welcome email done, remaining templates need HTML footer updates

---

## COMPLETED IMPROVEMENTS

### Dashboard UX ✅
- [x] **Add "next check in X minutes" countdown** to monitor rows
- [x] **Add monitor health indicator** — Green/yellow/red dots based on error count
- [x] **Empty monitors state improvement** — Demo link + suggestions
- [x] **Add "last change X days ago"** — Shows relative time since last change

### Activation Flow ✅
- [x] **Pre-fill email in signup.html** — From ?email= URL param
- [x] **Gmail/Outlook quick-access buttons** — Already on check-email state
- [x] **Demo monitors feature** — Let new users try the product instantly

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
- [ ] **Log cron outcomes** — Store run results in Supabase for debugging
- [x] **Fix about.html**: Removed "Slack integration" and "7-day free trial" — replaced with honest "coming soon" messaging ✅ Session 26
- [ ] **Update admin.html URL**: Verify it still works at /api/stats?admin=1 (changed in Session 25)
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

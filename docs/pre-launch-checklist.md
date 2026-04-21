# Pre-Launch Checklist — getpricepulse.com

Use this before publishing to Show IH, Show HN, Twitter, cold email, etc.

---

## Technical Checklist (CRITICAL)

- [ ] **Domain resolves correctly**
  - [ ] https://getpricepulse.com loads landing page
  - [ ] SSL certificate is valid (no warnings)
  - [ ] Redirects work: /demo, /pricing, /about, /blog

- [ ] **Auth system is working**
  - [ ] Signup works (test email confirmation flow)
  - [ ] Email confirmation link works
  - [ ] Can select a plan after confirming
  - [ ] Dashboard loads for authenticated users
  - [ ] Can log out and log back in

- [ ] **Payment system is working**
  - [ ] Stripe Checkout button appears on plan-select.html
  - [ ] Can click through to Stripe (test mode)
  - [ ] Test payment processes (use Stripe test card: 4242424242424242)
  - [ ] Webhook fires successfully (check Stripe logs)
  - [ ] Subscription status updates in dashboard

- [ ] **Monitoring engine is running**
  - [ ] Can create a monitor in dashboard
  - [ ] Monitor shows "next check" time (not "error")
  - [ ] First monitor run completes (check logs, not just UI)
  - [ ] Email alert arrives (test with your own email)
  - [ ] Diff preview is readable and shows the change

- [ ] **Email system is working**
  - [ ] Waitlist signup email is received
  - [ ] Password reset email arrives
  - [ ] Email confirmation works
  - [ ] Email alerts arrive with proper formatting
  - [ ] Unsubscribe link works (if added)

- [ ] **Performance**
  - [ ] Homepage loads in <3 seconds
  - [ ] Forms are responsive
  - [ ] Mobile hamburger menu works
  - [ ] No JavaScript errors in console

- [ ] **Security**
  - [ ] No sensitive keys exposed (check .env references)
  - [ ] HTTPS enforced (test with http:// in browser)
  - [ ] CORS headers are correct (test from different domain if possible)
  - [ ] Form inputs are sanitized (no obvious injection vectors)

---

## Content Checklist

- [ ] **Landing page is optimized**
  - [ ] Hero copy is compelling (unique value prop is clear)
  - [ ] CTA button is prominent ("See Demo" or "Start Free")
  - [ ] Feature list is scannable (not walls of text)
  - [ ] Pricing is clear and visible
  - [ ] FAQ answers common objections
  - [ ] Social proof section is present (even if placeholder)

- [ ] **All pages have proper metadata**
  - [ ] og:title and og:description on all pages
  - [ ] og:image is set (og-image.svg or custom)
  - [ ] canonical URL is correct (getpricepulse.com, not localhost or Vercel subdomain)
  - [ ] Twitter card metadata is present

- [ ] **Blog posts are discoverable**
  - [ ] All blog posts are linked from blog.html
  - [ ] Blog posts appear in sitemap.xml
  - [ ] Internal links between posts exist (2-3 per post minimum)
  - [ ] Related posts section at bottom of each post

- [ ] **Copy is accurate**
  - [ ] No typos or grammar errors (read each page out loud)
  - [ ] Product features match what's actually built
  - [ ] Pricing matches Stripe configuration
  - [ ] Plan limits match what's enforced (2/10/unlimited)
  - [ ] No references to "coming soon" features

- [ ] **Help & Support is adequate**
  - [ ] FAQ on landing page covers: what is it, how does it work, pricing, privacy, uptime
  - [ ] Demo page is intuitive (can someone understand the product without explanation?)
  - [ ] About page explains your story (why you built this)
  - [ ] Footer has support email and links
  - [ ] 404 page exists and links back home

---

## Marketing Checklist

- [ ] **Assets are ready**
  - [ ] Show IH draft is final (docs/show-ih-draft.md)
  - [ ] Show HN draft is final (docs/show-hn-draft.md)
  - [ ] Twitter threads are written (docs/twitter-threads.md)
  - [ ] Cold email templates are ready (docs/cold-email-template.md)
  - [ ] Product Hunt draft is complete (docs/product-hunt-draft.md)

- [ ] **Links are correct**
  - [ ] All distribution assets point to getpricepulse.com (not race-claude.vercel.app)
  - [ ] Demo links work (e.g., /demo.html is accessible)
  - [ ] Blog post links work
  - [ ] No broken internal links

- [ ] **Social proof is present**
  - [ ] Founder story is compelling (why you built this)
  - [ ] Testimonial placeholder (even if first real user testimonial pending)
  - [ ] Stats/metrics if available (# of monitors, # of pricing changes tracked, etc.)

---

## Distribution Checklist (Before Going Public)

- [ ] **Social accounts are set up**
  - [ ] Twitter/X account created (@getpricepulse or similar)
  - [ ] Profile bio is filled in
  - [ ] Link in bio points to getpricepulse.com
  - [ ] Profile picture is PricePulse logo or founder photo

- [ ] **Email list is ready**
  - [ ] Waitlist is functional (people can signup)
  - [ ] Confirmation email template is tested
  - [ ] Welcome email is queued or automated
  - [ ] You can send batch emails (for Show IH announcement, etc.)

- [ ] **Outreach is prepared**
  - [ ] Cold email list is built (50+ targets at minimum)
  - [ ] Cold email templates are personalized and ready
  - [ ] Follow-up sequence is planned (3 emails over 2 weeks)
  - [ ] Calendar reminder set to send first batch

- [ ] **Monitoring is set up**
  - [ ] Analytics pixel is installed (or plan for manual tracking)
  - [ ] UTM parameters are set up in distribution links
  - [ ] Spreadsheet or tool for tracking: signups, conversions, MRR
  - [ ] Slack notification set up for new Stripe charges (if possible)

---

## Launch Sequence Checklist

### Phase 1: Warm Audience (Day 1)

- [ ] Email existing waitlist: "Launching today, come check it out"
- [ ] Post about launch on personal social accounts
- [ ] Let 5-10 close friends/mentors know about launch

### Phase 2: Community (Day 1-2)

- [ ] Publish Show IH post (docs/show-ih-draft.md)
- [ ] Engage with IH post: answer questions, thank for feedback
- [ ] Post Show HN draft when ready (need 10+ real users per docs/show-hn-draft.md, so skip for now unless we have them)
- [ ] Share in relevant Slack communities (Indie Hackers, SaaS, founder groups)

### Phase 3: Content Distribution (Day 2-7)

- [ ] Post Twitter thread #1 (problem angle)
- [ ] Post Twitter thread #2 (technical angle) — 3 days later
- [ ] Post Twitter thread #3 (data angle) — 3 days later
- [ ] Tag relevant accounts (@indiehackers, @tjholowaychuk, etc.)
- [ ] Engage with replies and retweets

### Phase 4: Cold Outreach (Day 3+)

- [ ] Send first batch of cold emails (25-50)
- [ ] Personalize each subject line (mention their competitor name)
- [ ] Prepare to respond to replies quickly
- [ ] Track response rates in spreadsheet

### Phase 5: Momentum (Week 2+)

- [ ] Share wins/metrics in tweets and on IH
- [ ] Publish "learnings" blog post if interesting
- [ ] Push harder on highest-converting source
- [ ] Send cold email follow-up sequences
- [ ] Prepare for Show HN once we have 10+ real users

---

## Go/No-Go Decision

**Go if:**
- ✅ All technical items are passing (no auth bugs, no payment bugs, no monitoring errors)
- ✅ Copy is polished and brand-voice is consistent
- ✅ Landing page loads fast and converts visitors to signups
- ✅ Distribution assets are ready (at least 2 of: IH, Twitter, cold email)

**No-Go if:**
- ❌ Auth system has bugs (signup/confirmation broken)
- ❌ Payment doesn't work (can't test Stripe flow)
- ❌ Monitoring engine doesn't run (cron fails, no alerts sent)
- ❌ Domain doesn't resolve or has SSL errors
- ❌ Copy has typos or inaccurate feature claims

---

## Metrics to Track Day 1

- [ ] Visitors to landing page
- [ ] Signups via waitlist form
- [ ] Completed email confirmations
- [ ] Free plan signups (started but didn't pay)
- [ ] Paid plan signups (Starter or Pro)
- [ ] Monitors created (people actually using the product)
- [ ] First alert sent (activation!)

**Target for Day 1:** 50-100 visitors, 10-20 signups, 1-2 paid

---

## First Week Checkpoints

- [ ] Day 3: 150+ total signups
- [ ] Day 5: 3-5 paid conversions ($57-95 MRR)
- [ ] Day 7: 250+ total signups, 10+ paid conversions ($190+ MRR)
- [ ] First active user cohort (people creating monitors, getting alerts)

---

## Notes

- Keep this checklist near your desk during launch week
- Do NOT launch if any technical item is failing (auth bugs especially)
- It's better to delay 1 day and fix a bug than launch broken
- You can ship features later, but launch day is your one shot at "news"

# Post-Launch Quality Verification Checklist

**Last Updated:** April 30, 2026
**Purpose:** Verify all systems operational when signups arrive and during week 1-4

---

## 🔐 Authentication & Signup

- [ ] Signup page loads correctly
- [ ] Email verification sends within 30 seconds
- [ ] Email verification link works (test with new email)
- [ ] Password reset flow works
- [ ] Password requirements clearly shown
- [ ] Login works after signup
- [ ] Session persists across page reloads
- [ ] Logout clears session correctly
- [ ] OAuth coming soon messaging (if applicable)

**Test case:** Sign up with test email, verify email, login, confirm dashboard shows

---

## 💳 Stripe Payment Integration

- [ ] Pricing page shows all tiers correctly
- [ ] "Start Free" button works, creates Free user
- [ ] "Upgrade" button opens Stripe checkout
- [ ] Checkout shows correct price ($9/mo for Starter, $49/mo for Pro)
- [ ] Checkout has email pre-filled
- [ ] Payment succeeds with test card (4242 4242 4242 4242)
- [ ] Subscription status updates immediately post-payment
- [ ] User sees "Starter" or "Pro" badge in dashboard
- [ ] Upgrade limits enforced (Free: 5, Starter: 15, Pro: unlimited monitors)
- [ ] Invoice email arrives within 1 minute
- [ ] Subscription can be cancelled (removes Starter features)

**Test case:** Upgrade from Free → Starter, verify limits change, cancel subscription, verify downgrade

---

## 📨 Email System

### Welcome & Nurture Emails
- [ ] Welcome email arrives within 2 minutes (to Starter users)
- [ ] Welcome has all links working
- [ ] Activation email arrives at day 1 (if monitor not added)
- [ ] Upgrade reminder arrives at day 3 (if still Free tier)
- [ ] Re-engagement email arrives at day 7 (if no activity)
- [ ] All emails have unsubscribe link
- [ ] Unsubscribe link removes from nurture list (doesn't affect alerts)

### Price Change Alerts
- [ ] Alert email arrives within 2 minutes of change detection
- [ ] Alert shows: company name, change details, link to monitor
- [ ] Alert links work correctly (utm tracking in place)
- [ ] No duplicate alerts for same change
- [ ] Email formatting looks good on mobile
- [ ] Unsubscribe from alerts works (separate from nurture)

### Weekly Digest
- [ ] Digest arrives every Monday 9am (UTC?)
- [ ] Digest includes all price changes from past week
- [ ] Digest formatting is readable
- [ ] Digest subject includes week date range

**Test case:** Create monitor, wait for pricing detection, verify alert email arrives with correct data

---

## 🎯 Core Product Features

### Add Monitor
- [ ] Search for company works (autocomplete or list)
- [ ] Add monitor shows confirmation
- [ ] Monitor appears in dashboard immediately
- [ ] Monitor page shows: company name, URL, last checked time, status
- [ ] Free tier max 5 monitors enforced (can't add 6th)
- [ ] Starter tier max 15 monitors enforced
- [ ] Pro tier unlimited monitors work
- [ ] Can't add duplicate monitor for same company

**Test case:** Add "Stripe", "Notion", "HubSpot" monitors, verify limit enforcement

### Delete Monitor
- [ ] Delete button works, asks for confirmation
- [ ] Monitor removed from dashboard immediately
- [ ] Can add new monitors after deleting (limit resets)
- [ ] Historical alerts stay accessible (?)

### Dashboard
- [ ] Shows all user's monitors in a list
- [ ] Next check time shows and counts down
- [ ] "Last changed" shows correctly
- [ ] Monitor health indicator shows (green/yellow/red)
- [ ] "Seed demo monitors" button works (adds 5 popular companies)
- [ ] Demo monitors work and get checked normally

### Pricing Tracker
- [ ] 49 company cards load correctly
- [ ] Search filters companies by name
- [ ] Click monitor button adds to dashboard (if Free → directs to pricing)
- [ ] Links to individual company pages work
- [ ] Mobile layout is responsive

---

## 🌐 Public Pages

- [ ] Homepage loads and responsive
- [ ] Blog loads and links work
- [ ] Pricing page shows all tiers
- [ ] Pricing tracker page fully functional
- [ ] Demo page shows price changes example
- [ ] About page loads
- [ ] Privacy policy page loads
- [ ] Terms page loads
- [ ] Show HN landing page (/hn.html) loads
- [ ] Show IH landing page (/ih.html) loads
- [ ] All pages have correct OG tags (sharing looks good)
- [ ] All pages mobile responsive

---

## 📊 Admin Dashboard (/admin.html)

- [ ] Password protection works (ADMIN_SECRET required)
- [ ] Dashboard loads with current metrics
- [ ] Total signups count accurate
- [ ] MRR calculation correct
- [ ] Plan distribution pie chart shows breakdown
- [ ] Email stats show open rates, bounces
- [ ] Recent signups list shows newest users
- [ ] Signup source breakdown shows utm_source distribution
- [ ] Last cron run shows timestamp
- [ ] Recent cron runs table shows latest 10 runs
- [ ] System health section shows status indicators
- [ ] All metrics auto-refresh (or manual refresh works)

**Test case:** Create 3 test signups, verify they appear in "Recent signups" within 1 min

---

## 🔔 Monitoring Engine (Backend)

- [ ] Cron runs every hour at :00 (UTC)
- [ ] Monitor fetch succeeds (HTTP 200)
- [ ] Noise filter correctly ignores non-pricing changes
- [ ] Price changes detected and logged in admin
- [ ] Alerts triggered and sent to users within 2 minutes
- [ ] Cron runs logged in `cron_runs` table
- [ ] Failed monitors show error message (DNS fail, timeout, etc)
- [ ] Retry logic works (failed monitor retries next hour)

**Test case:** Trigger price change on test monitor, verify alert email arrives

---

## 🔍 SEO & Technical

- [ ] Sitemap.xml exists and valid (https://getpricepulse.com/sitemap.xml)
- [ ] Robots.txt allows indexing
- [ ] Structured data (JSON-LD) present on key pages
- [ ] Page titles are unique and descriptive
- [ ] Meta descriptions present
- [ ] H1 present on all pages (exactly 1 per page)
- [ ] Images have alt text
- [ ] Links have descriptive anchor text (not "click here")
- [ ] Mobile friendly (tested on 375px width)
- [ ] Load time <3 seconds (tested with Lighthouse)
- [ ] No 404 errors in logs

---

## 📱 Mobile Experience

- [ ] Signup flow works on mobile
- [ ] Dashboard is usable on mobile (no horizontal scroll)
- [ ] Add monitor works on mobile search
- [ ] Pricing table legible on mobile
- [ ] Buttons are large enough (touch targets >44px)
- [ ] No broken layout shifts
- [ ] Forms are mobile-optimized (large inputs)

**Test case:** Signup and add monitor on iPhone 12 (375px) or smaller

---

## 🛡️ Security & Privacy

- [ ] All traffic HTTPS (no mixed content warnings)
- [ ] No sensitive data in URLs (passwords, auth tokens)
- [ ] CSRF token present on forms
- [ ] XSS prevented (user input sanitized)
- [ ] SQL injection prevented (parameterized queries)
- [ ] Rate limiting on signup endpoint (prevent abuse)
- [ ] ADMIN_SECRET not committed to public repo
- [ ] Password reset token expires in 24h
- [ ] Session timeout after 30 days inactivity
- [ ] Supabase RLS policies enforced (users can't see other users' data)

---

## 📈 Analytics & Tracking

- [ ] utm_source tracking works on signup link
- [ ] utm_source stored in user record
- [ ] Admin dashboard shows utm_source breakdown
- [ ] Calculator email capture utm_source=calculator
- [ ] Newsletter utm_source=newsletter_[name]
- [ ] HN utm_source=hn
- [ ] LinkedIn utm_source=linkedin
- [ ] IH utm_source=ih
- [ ] Google Analytics (if installed) tracking events

**Test case:** Sign up via link with ?utm_source=test, verify it shows in admin

---

## 🚨 Error Handling

- [ ] 404 page is friendly and links back to home
- [ ] 500 error page shows helpful message
- [ ] Form validation shows error messages
- [ ] Network error shows retry option
- [ ] Out of monitors message clear (links to pricing)
- [ ] Payment failed error explains what went wrong
- [ ] Email delivery failure graceful (doesn't break signup)

---

## 💾 Backup & Data

- [ ] Database backups run daily (verify in Supabase)
- [ ] Can restore from backup without downtime
- [ ] User data GDPR exportable
- [ ] User deletion works (full data removal)

---

## Session 132 Testing Plan

**When signups arrive, run this checklist in order:**

1. **Hour 0-2:** Quick verification (Auth, Email, Dashboard, Admin)
2. **Hour 2-6:** Feature verification (Add monitor, Stripe, Alerts)
3. **Day 1:** Public page verification (Homepage, Blog, Tracker)
4. **Day 2:** Mobile verification (Signup, Dashboard on mobile)
5. **Day 3:** Analytics verification (utm tracking in admin)
6. **Day 5:** Backend health check (Cron runs, alerts, email stats)
7. **Day 7:** Full regression (All checkboxes above)

**Issue found?**
- [ ] Document in GitHub issue with reproduction steps
- [ ] Test if user-facing or admin-only
- [ ] Fix in next session (URGENT if user-facing)
- [ ] Re-test after fix

---

## Sign-Off

**Date tested:** __________
**Tester:** __________
**All boxes checked?** YES / NO
**If NO, issues filed:** [GitHub issue links]
**Production ready?** YES / NO


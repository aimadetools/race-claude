# Pre-Launch Technical Verification Checklist

**Run this Monday morning (April 28, 9:00 AM) before publishing Show IH post**

This checklist verifies that all systems are operational and ready for launch traffic.

---

## 🔍 Quick Health Check (5 minutes)

### Site Availability
- [ ] Homepage loads: https://www.getpricepulse.com/
- [ ] No SSL certificate warnings
- [ ] No 404 or 500 errors in browser console
- [ ] Page loads in under 3 seconds

### Key Pages Load
- [ ] Pricing page: https://www.getpricepulse.com/pricing.html (check all pricing cards)
- [ ] Pricing tracker: https://www.getpricepulse.com/pricing-tracker.html (check 40 companies visible)
- [ ] Blog: https://www.getpricepulse.com/blog.html (verify 27 posts in feed)
- [ ] About: https://www.getpricepulse.com/about.html
- [ ] Dashboard: https://www.getpricepulse.com/dashboard.html

**If any page fails:**
- Check browser console for JS errors
- Hard refresh (Ctrl+Shift+R on Windows/Cmd+Shift+R on Mac)
- If still broken, check Vercel deployment status: https://vercel.com

---

## 🎯 Core Functionality Check (10 minutes)

### Signup Flow (Full Test)
1. [ ] Clear cookies (Ctrl+Shift+Delete → Clear all)
2. [ ] Go to https://www.getpricepulse.com/signup.html
3. [ ] **Email field pre-filled?** (Check URL param works: ?email=test@example.com)
4. [ ] Enter unique test email (e.g., `test-launch-2026-04-28@example.com`)
5. [ ] Click "Create Free Account"
6. [ ] **Auth redirects to confirmation page?** (/confirm.html)
7. [ ] Check email inbox (check spam folder too)
8. [ ] **Confirmation email arrives within 30 seconds?** (from hello@getpricepulse.com)
9. [ ] Click confirmation link in email
10. [ ] **Dashboard loads with "Add your first monitor" state?**

**If signup fails:**
- Check Supabase Auth settings: https://app.supabase.com → Authentication → Providers
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in Vercel env vars
- Check browser console for CORS errors

### Demo Monitors (Seed Test)
1. [ ] From empty dashboard, click "Try demo monitors"
2. [ ] **5 demo monitors appear instantly?** (Stripe, Slack, GitHub, etc.)
3. [ ] Next check countdowns visible on each monitor
4. [ ] Monitor health dots visible (should be green)
5. [ ] Click "View details" on a monitor → **Monitor details modal opens?**

**If demo seed fails:**
- Check browser console for fetch errors
- Verify /api/seed-demo-monitors endpoint: test with curl
```bash
curl -X POST https://www.getpricepulse.com/api/seed-demo-monitors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEST_JWT"
```

### Dashboard Features
1. [ ] Demo monitors list visible with all columns (name, type, status, next check, health)
2. [ ] Clicking monitor → details modal shows price and last change time
3. [ ] "Monitor something new" button visible and clickable
4. [ ] "View pricing" button visible and clickable

---

## 📧 Email System Check (5 minutes)

### Email Sending Test
1. [ ] Go to admin.html: https://www.getpricepulse.com/admin.html
2. [ ] Enter ADMIN_SECRET (from Vercel env var, starts with `3d3cc074...`)
3. [ ] Check **"Recent cron runs"** table
   - Last run should be within last 10 minutes
   - Status should be "success" (green)
4. [ ] Check **"Email stats"** section
   - Verify numbers make sense (emails sent > 0)
   - No errors in recent runs

### Email from Address
1. [ ] Open the test email you received earlier
2. [ ] From address should be: `PricePulse <hello@getpricepulse.com>`
3. [ ] **NOT** a Resend auto-generated address

**If email system issues:**
- Check Resend dashboard: https://resend.com/emails
- Verify RESEND_FROM in Vercel env vars
- Check VPS cron logs (ask human to SSH in if needed)

---

## 🔐 Authentication & Payments

### Stripe Checkout
1. [ ] Go to pricing page: https://www.getpricepulse.com/pricing.html
2. [ ] Select a plan (Starter: $19/mo)
3. [ ] Click "Get Started" button
4. [ ] **Stripe Checkout modal opens?** (Shows product name, price, card form)
5. [ ] **NOT** a 404 or blank page

**Test card (do NOT complete):**
- Card: 4242 4242 4242 4242
- Expiry: 12/34
- CVC: 123
- **DO NOT SUBMIT** (test is just that modal opens)

**If Stripe fails:**
- Check Vercel env vars: STRIPE_SECRET_KEY, STRIPE_PRICE_ID_STARTER, STRIPE_PRICE_ID_PRO
- Verify webhook secret: STRIPE_WEBHOOK_SECRET configured
- Check Stripe dashboard: https://dashboard.stripe.com

---

## 📱 Mobile Check (5 minutes)

Open each page on mobile or use Chrome DevTools (Ctrl+Shift+I → Toggle device toolbar):

- [ ] Homepage responsive (no horizontal scroll)
- [ ] Pricing cards stack vertically
- [ ] Pricing tracker companies visible in 2-column grid
- [ ] Navigation hamburger menu works
- [ ] Signup form fits on screen
- [ ] Dashboard monitors visible without scroll

---

## 🔗 Link Verification (5 minutes)

**Show IH Post Links** — Test each link in Show IH draft:
- [ ] https://www.getpricepulse.com (site link)
- [ ] https://www.getpricepulse.com/pricing-tracker.html (tracker proof)
- [ ] https://www.getpricepulse.com/pricing.html (pricing link)

**Blog Links** — Check blog homepage has all 27 posts:
- [ ] 27 posts visible in blog feed
- [ ] Click 1-2 random posts → pages load
- [ ] "Back to blog" link works

**Pricing Tracker Company Links**:
- [ ] Click 3 random company cards → details modal shows changes
- [ ] Share button (Twitter) generates correct URL

---

## 🎛️ Admin Dashboard Deep Check

1. [ ] Go to https://www.getpricepulse.com/admin.html
2. [ ] Enter ADMIN_SECRET
3. [ ] Check **statistics section**:
   - [ ] MRR > $0 (if you have test subscriptions)
   - [ ] User count >= 1 (your test account)
   - [ ] Email stats show activity
4. [ ] Check **recent cron runs**:
   - [ ] At least 1 successful run in last hour
   - [ ] No error messages

---

## 🚀 Final Go/No-Go Decision

### ✅ GO LIVE if:
- [x] All pages load without errors
- [x] Signup flow completes end-to-end
- [x] Email system working (confirmation emails arrive)
- [x] Demo monitors seed successfully
- [x] Admin dashboard accessible
- [x] Mobile responsive
- [x] No console errors on main pages
- [x] Stripe checkout modal opens

### 🛑 DO NOT LAUNCH if:
- ❌ Any critical page (homepage, pricing, signup, dashboard) won't load
- ❌ Signup doesn't work (can't create account)
- ❌ Confirmation emails not arriving within 2 minutes
- ❌ Stripe checkout fails completely
- ❌ Admin dashboard inaccessible or showing errors
- ❌ Cron jobs failing (red status in recent runs)

**If issues found:**
1. Try hard refresh (Ctrl+Shift+R)
2. Check Vercel deployment: https://vercel.com/projects/race-claude
3. Look for recent failed builds or errors
4. Check database: https://app.supabase.com (look for connection errors)
5. If unfixable immediately: delay launch 1-2 hours and investigate root cause

---

## 📋 Pre-Publication Checklist

Before clicking "Publish" on Show IH:

- [ ] This verification checklist: **ALL PASSED** ✅
- [ ] LAUNCH-PLAYBOOK.md reviewed (know what to do Monday)
- [ ] Browser tabs open:
  - [ ] Show IH draft (ready to copy-paste)
  - [ ] Admin dashboard (for monitoring)
  - [ ] Gmail/email (to check confirmation emails, comments)
  - [ ] Twitter/X (for engagement)
  - [ ] Launch week monitoring guide (for decision tree reference)
- [ ] Time: **9:30 AM Monday, April 28**
- [ ] Network: **Stable/reliable internet** (not on phone hotspot if possible)
- [ ] No distractions: **Full focus for 6 PM**

---

## 🎯 Critical Success Metrics (Monitor Every Hour)

During Day 1, track these metrics hourly (use admin.html):

| Time | Target | What to Check | If Below Target |
|------|--------|---------------|-----------------|
| 10 AM | 5+ signups | User count in admin | Check Show IH — got upvotes? Link clicks? |
| 12 PM | 20+ signups | User count in admin | Are people clicking through? Email issues? |
| 3 PM | 50+ signups | User count in admin | Has momentum started? Spike expected by afternoon |
| 6 PM | 100+ signups | User count in admin | Tweet links, engage comments, send cold emails |

---

## 🆘 Emergency Contacts

If something breaks during Day 1:

**Site Down / 500 Errors:**
- Check Vercel status: https://vercel.com
- Check Supabase status: https://status.supabase.com
- If down: wait or check GitHub for error logs

**Signup Not Working:**
- Check Supabase: Are new user records being created?
- Check email: Are confirmation emails sending?
- Browser console: Any auth errors?

**Emails Not Arriving:**
- Check Resend dashboard for bounces
- Check spam folder
- Verify hello@getpricepulse.com is in "from" address

**Stripe Issues:**
- Check Stripe dashboard for webhook events
- Verify webhook signing secret matches

**Cron Jobs Not Running:**
- VPS monitor-run.js should run at :00 every hour
- Check VPS logs if accessible
- Manual alternative: Use Vercel API if needed (lower priority, only if VPS down)

---

## ✅ Verification Completed

**Date:** _____________
**Time:** _____________
**Verified by:** _____________

**All systems operational and ready for launch:**
- [ ] YES ✅ → Proceed to Show IH publication
- [ ] NO ❌ → Document issues and fix before publishing

**Notes/Issues found:**
```


```

---

**Next step:** If ALL GREEN, go publish the Show IH post! 🚀
Follow MONDAY-LAUNCH-CHECKLIST.md for the hour-by-hour timeline.

# Launch Environment Setup — April 28 Checklist

**Do this on Sunday April 27, evening. Get your tools, tabs, and passwords ready so you can move fast on Monday morning.**

---

## 🔐 PASSWORDS & CREDENTIALS (Save Locally)

### Critical Passwords Needed for Day 1

Create a local text file (or paste into a password manager) with these:

```
ADMIN_SECRET: [SEE HELP-STATUS.md line 46]
Resend API Key: [In Vercel env vars]
Supabase URL: https://bagmqtxdlogfpfqcvzof.supabase.co
Supabase Anon Key: [In docs or Vercel]
Stripe Secret Key: [In Vercel env vars, needed for webhook check only]
```

**Where to get them:**
- ADMIN_SECRET: Check HELP-STATUS.md (human set this up in Session 22)
- Resend/Supabase/Stripe: Check Vercel project settings → Environment Variables
- **Or:** Open Vercel dashboard → race-claude project → Settings → Environment Variables

---

## 📱 BROWSER TABS — Bookmark These NOW (April 27)

### Create a Chrome bookmark folder called "🚀 LAUNCH" with these tabs:

**Critical (Open Monday 9:30 AM):**
1. Admin dashboard (live metrics)
   - https://www.getpricepulse.com/admin.html?admin=1
   - Bookmark it. You'll refresh this every hour.

2. Show IH post (after you publish)
   - https://indiehackers.com/post
   - First draft: /docs/show-ih-draft.md
   - Paste content after you open the link on IH

3. Live site (verify all pages loading)
   - https://www.getpricepulse.com (homepage)
   - https://www.getpricepulse.com/pricing-tracker.html (proof of concept)
   - https://www.getpricepulse.com/demo.html (interactive demo)

**Secondary (Have open but don't obsess):**
4. Launch metrics tracker (local)
   - Open file: `/home/race/race-claude/launch-metrics.html`
   - Drag to a second monitor or third tab

5. Gmail inbox (for cold email replies)
   - https://mail.google.com

6. Resend dashboard (email stats)
   - https://resend.com → Login
   - Check email open rates, bounces

7. Supabase dashboard (database stats)
   - https://supabase.com → Login
   - Monitor email_log table for any errors

8. Twitter (engagement + posting)
   - https://twitter.com
   - Have this open for retweets, quote replies

---

## 💾 LOCAL FILES TO HAVE OPEN (Sunday Prep)

### Get These Files Ready to Copy-Paste

**In your text editor or Notes app:**

1. **Cold Email Templates** (ready to copy)
   - Open: `/home/race/race-claude/docs/cold-email-template.md`
   - Copy templates 1–5 to a local note
   - Have 3–5 variations ready to paste

2. **Show IH Response Guide** (bookmark it)
   - Open: `/home/race/race-claude/docs/show-ih-response-guide.md`
   - This has answer templates for common objections

3. **Twitter Thread Ideas** (inspiration)
   - Open: `/home/race/race-claude/docs/twitter-threads.md`
   - Have 3–5 thread outlines ready
   - You'll tweet starting Day 2

4. **Launch Day Success Signals** (quick reference)
   - Open: `/home/race/race-claude/docs/launch-day-success-signals.md`
   - Screenshot it or print it out
   - Keep it visible during Day 1

5. **Launch Week Monitoring Guide** (for decisions)
   - Open: `/home/race/race-claude/docs/launch-week-monitoring-guide.md`
   - Reference this when metrics look off
   - Use the decision trees to choose next action

---

## 🖥️ RECOMMENDED WORKSPACE SETUP (Day 1)

### Monitor 1 (Main)
- **Left side:** Admin dashboard (/admin.html)
- **Right side:** Show IH post (https://indiehackers.com/post)
- **Both full height, refresh both every 30 min**

### Monitor 2 (Secondary) — If you have one
- **Main tab:** Gmail (watch for cold email replies)
- **Secondary tabs:** Twitter + Resend dashboard
- **Bottom:** Timer app (set it for "check metrics every 2 hours")

### Single Monitor Setup
1. **Chrome** with these tabs in order:
   - Admin dashboard (reload this constantly)
   - Show IH (monitor for new comments)
   - Gmail (watch for replies)
   - Twitter (engagement)
   - Metrics tracker (reference, not constant)

2. **Phone**
   - Open Resend app (if available) or bookmark Resend dashboard
   - Open https://www.getpricepulse.com and test signup yourself
   - Keep phone near for notifications

---

## ✅ SETUP CHECKLIST (Do This Sunday Evening)

- [ ] **Passwords:** Save ADMIN_SECRET and Resend key locally
- [ ] **Browser:** Bookmark all critical tabs in a "🚀 LAUNCH" folder
- [ ] **Files:** Open all 5 guide files in text editor tabs
- [ ] **Email:** Set up Gmail label "PricePulse Signups" (filter emails from mailer@...)
- [ ] **Notification:** Set calendar alert for "Check metrics every 2 hours on Day 1"
- [ ] **Test:** Sign up yourself on incognito window — verify welcome email arrives
- [ ] **Test:** Try upgrading to Starter/Pro — verify Stripe checkout works
- [ ] **Test:** Load /admin.html — verify you can login with ADMIN_SECRET
- [ ] **Charge device:** Laptop fully charged; have power cable nearby
- [ ] **Notifications:** Enable email notifications for IH and Twitter so you see replies instantly

---

## 🔧 FINAL VERIFICATION (Sunday 5 PM)

**Run this quick checklist to ensure everything works:**

### Site Tests
- [ ] Homepage loads (should say "Know when competitors change their pricing")
- [ ] Signup page loads (should have email field + signup button)
- [ ] Pricing page loads (should show Free, Starter, Pro tiers)
- [ ] Pricing tracker loads (should show 40 company cards)
- [ ] Blog page loads (should show 27 blog post cards)
- [ ] Demo page loads (should show interactive demo)
- [ ] Dashboard loads (should show "Create your first monitor" empty state)

### Auth Tests
- [ ] Try signing up with test email (check welcome email arrives)
- [ ] Try logging in with test account
- [ ] Verify demo monitors button works
- [ ] Verify free tier shows "Free" label on dashboard

### Admin Tests
- [ ] Login to admin.html with ADMIN_SECRET
- [ ] Dashboard should show current stats (user count, MRR, etc.)
- [ ] Refresh page — stats should update (or stay stable)
- [ ] Check email sending: Resend dashboard should show recent sends

### Email Tests
- [ ] Send test email to yourself via /api/test-email
- [ ] Verify it arrives in your inbox
- [ ] Check Resend dashboard for email record

---

## 📅 TIMELINE FOR LAUNCH DAY (Monday, April 28)

### Sunday (April 27)
- [ ] 2 PM: Complete all items in this checklist
- [ ] 4 PM: Run final verification tests
- [ ] 5 PM: Review Show IH draft one more time (make any final edits)
- [ ] 6 PM: Sleep well — you've earned it

### Monday (April 28)
- [ ] 8:00 AM: Wake up, check admin.html (should show 0 signups, that's normal)
- [ ] 8:30 AM: Review MONDAY-LAUNCH-CHECKLIST.md one more time
- [ ] 9:00 AM: Open all browser tabs and tools
- [ ] 9:30 AM: Publish Show IH post (copy/paste from docs/show-ih-draft.md)
- [ ] 9:35 AM: Tweet "I'm live on IH!" (include link, keep casual)
- [ ] 10:00 AM: Start checking metrics (first checkpoint)
- [ ] 2:00 PM: Send cold email batch 1 (10-15 emails)
- [ ] 6:00 PM: Final metrics snapshot + log Day 1 summary
- [ ] 6:30 PM: Plan Day 2 (which cold emails to send, which Twitter threads to post)

---

## 💡 PRO TIPS FOR LAUNCH DAY SUCCESS

### **Attention & Energy**
- **Turn off Slack/Discord/email notifications.** You'll check them intentionally at set times, not reactively.
- **Set phone to Do Not Disturb.** You'll check it every 2 hours for IH/email notifications.
- **Take breaks.** Monitor engagement for 30 minutes, then step away for 10. Burnout = bad decisions.
- **Eat lunch at a set time** (not at your desk). You need brain fuel.

### **Show IH Engagement**
- **Reply to EVERY comment** within 1 hour if you see it. This is not optional.
- **Be conversational, not salesy.** Answer the question they're actually asking.
- **Have the response guide open.** Refer to `/docs/show-ih-response-guide.md` for common Q&A.
- **If someone says "not interested":** Don't argue. Reply "Thanks for checking it out!" and move on.
- **If someone finds a bug:** Say "Great catch! I'll fix that today" and actually fix it if possible.

### **Cold Email Batch 1 Strategy**
- **Send at 2–3 PM (not morning).** Founders check email afternoon before EOD.
- **Personalize first 5–10.** Takes 1 min per email, worth it.
- **Include pricing tracker link.** "Here's 40 real examples of pricing changes we've detected..."
- **No follow-up until Day 3.** Let batch 1 settle first.

### **Admin Dashboard**
- **Don't obsess over minute-to-minute changes.** Stats update every 5–10 minutes; check every 30 min instead.
- **Take hourly screenshots.** Helps you spot trends (are signups accelerating or plateauing?).
- **Note what time people sign up.** If most signups happen 10 AM–12 PM, that's when IH visibility peaks.

### **Metrics Interpretation**
- **20 signups by 6 PM = WIN.** This is solid Day 1. You're on track.
- **5 signups by 6 PM = Don't panic.** Show IH algorithm takes time. It may spike on Day 2.
- **0 paid conversions = Normal.** Don't expect conversions until Day 2–3 (people need time to test).
- **If Show IH has 50+ upvotes but 0 signups = Something's broken.** Check: is site loading? Are links right? Test signup yourself.

---

## 🚨 EMERGENCY CONTACTS (If Something Breaks)

**If the site goes down:**
1. Check Vercel dashboard: https://vercel.com/dashboard
2. Look for recent deployments — did something auto-deploy?
3. Check: Are API endpoints responding? (Hit /api/stats)
4. Restart: If code broke, push a fix to main branch (auto-deploys)

**If emails aren't sending:**
1. Check Resend dashboard for send errors
2. Check Supabase email_log table for failed sends
3. Verify RESEND_API_KEY is still in Vercel env vars
4. If Resend is down, switch to manual notifications (post update on Twitter + IH comment)

**If signups suddenly stop:**
1. Test signup yourself (incognito window)
2. Check Supabase → auth table → are new users being created?
3. If auth is broken, check Supabase Auth configuration
4. If broken, post "Temporary signup issue, back in 30 min" on IH

**If you can't access admin.html:**
1. Verify ADMIN_SECRET is correct (check HELP-STATUS.md)
2. Try: https://www.getpricepulse.com/admin.html?admin=1 (with ?admin=1 param)
3. Clear browser cache (Cmd+Shift+Delete) and reload
4. If still broken, check Vercel logs for API errors

---

## ✨ THE NIGHT BEFORE (Sunday 9 PM)

- [ ] Close all work tabs. You're done prepping.
- [ ] Read the launch day checklist one more time (in bed, relaxing)
- [ ] Set an alarm for 8:00 AM Monday
- [ ] Go to sleep knowing you've built something real and prepared well
- [ ] Monday is just execution. You've got this. 🚀

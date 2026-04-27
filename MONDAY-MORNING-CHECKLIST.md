# 🚀 Monday Morning Checklist — April 28, 2026

**Launch Time: 9:30 AM**
**Expected outcome: 50-100 signups within 24 hours**

---

## ⏰ 8:00 AM — Preparation Phase (30 minutes)

### Step 1: Verify All Systems (5 minutes)
1. Open: https://www.getpricepulse.com/launch-ready-check.html
2. Let the system check run automatically
3. **If result is "READY FOR LAUNCH" → proceed to Step 2**
4. **If result is "AWAITING SCHEMA MIGRATION":**
   - Open Supabase console: https://app.supabase.com
   - Go to SQL editor
   - Copy & paste each migration file and run:
     1. `/home/race/race-claude/docs/schema-migration-unsubscribe.sql`
     2. `/home/race/race-claude/docs/schema-migration-alerts-unsubscribe.sql`
   - Wait for success messages
   - Re-run launch-ready-check.html
5. **If any other issue is shown:**
   - Contact AI for help (use HELP-REQUEST.md)
   - Critical issues must be fixed before marketing

### Step 2: Verify Dashboard Works (5 minutes)
1. Go to: https://www.getpricepulse.com/dashboard.html
2. Click "Sign up" and create a test account
3. Add one test monitor (e.g., "Test Company")
4. Verify you can see it on the dashboard
5. Verify you received a welcome email (check inbox, may be in spam)

### Step 3: Test Admin Dashboard (5 minutes)
1. Go to: https://www.getpricepulse.com/admin.html
2. Enter admin password: (provided in HELP-STATUS.md)
3. Verify stats show:
   - 1 total user (you)
   - 1 total monitor
   - Email log tracking (if applicable)

### Step 4: Open Marketing Assets (5 minutes)
1. Show IH draft: `/docs/show-ih-draft.md`
2. Twitter threads: `/docs/twitter-threads.md`
3. Cold email templates: `/docs/cold-email-template.md`
4. Verify all are clear and ready to use

### Step 5: Delete Test Account (5 minutes)
1. Go to: https://www.getpricepulse.com/dashboard.html
2. Sign out
3. Email: hello@getpricepulse.com with subject "Delete test account" (optional but cleaner)
4. Or leave it (won't affect Week 1 metrics)

---

## 🚀 9:30 AM — Launch Phase (5-10 minutes)

### Step 6: Publish Show IH Post (5 minutes)
1. Go to: https://indiehackers.com/post
2. Copy content from `/docs/show-ih-draft.md`
3. Main CTA link: https://www.getpricepulse.com/ih.html
4. Post with title: "I built a tool that monitors SaaS competitor pricing pages 24/7 so founders don't have to"
5. Copy your post URL (you'll need it for tracking)
6. **Note: Refresh admin.html to see real-time signups coming in**

### Step 7: Post First Tweet (1 minute)
1. Go to your Twitter/X account
2. Post first thread from `/docs/twitter-threads.md` (#1 - Problem Angle)
3. Tag @indiehackers in the thread
4. Include link: https://www.getpricepulse.com/?utm_source=twitter&utm_medium=thread&utm_campaign=founders_problem

---

## ⏸️ 9:45 AM - 12:00 PM — Monitor Phase (Ongoing)

### Every 15 minutes:
1. Refresh admin.html to see signup rate
2. Check Indie Hackers for comments and respond
3. Check hello@getpricepulse.com for replies

### Expected metrics:
- **By 12:00 PM (2.5h after launch):** 5-15 signups
- **By 5:00 PM (7.5h after launch):** 20-40 signups
- **By 11:00 PM (13.5h after launch):** 40-80 signups

---

## 📋 Success Metrics (Track Daily)

### Day 1 Target:
- ✓ 20+ signups
- ✓ 2-3 Show IH comments/conversations
- ✓ At least 1 paid plan signup

### Week 1 Target:
- ✓ 100+ total signups
- ✓ 10-20 paid conversions ($200-400 MRR)
- ✓ Multiple Show IH conversations showing value
- ✓ Twitter engagement (likes, retweets, follows)

---

## 🆘 If Something Goes Wrong

### "0 signups after 2 hours"
1. Check Show IH post: did it publish successfully?
2. Check admin.html: is it showing any errors?
3. Check hello@getpricepulse.com: any error reports?
4. If system check failed earlier, re-run launch-ready-check.html

### "Emails not sending to users"
1. Check admin.html for email_log errors
2. Re-run launch-ready-check.html to verify Resend API
3. Check MONDAY-LAUNCH-DATABASE-CHECKLIST.md — schema migrations may not be complete

### "Stripe payments failing"
1. Check Stripe dashboard: https://dashboard.stripe.com
2. Verify webhook events are coming in
3. Re-run launch-ready-check.html to verify Stripe API key

### "Dashboard not loading"
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Check browser console for errors (F12)
3. Try in incognito/private window
4. If still failing: This is a critical blocker, request help

---

## 📞 Emergency Contacts

If you need help during launch:
- **Critical code issues:** Use HELP-REQUEST.md (your new help budget starts at 60 minutes)
- **Stripe issues:** Contact Stripe support (https://support.stripe.com)
- **Resend issues:** Contact Resend (https://resend.com/support)
- **Supabase issues:** Contact Supabase (https://supabase.com/support)

---

## ✅ Post-Launch (End of Day)

1. **Log Day 1 Metrics** in `/docs/week1-launch-log.md`:
   - Total signups
   - Paid conversions
   - Revenue
   - Show IH comments received
   - Twitter engagement
   - Emails sent

2. **Plan Day 2 Actions**:
   - Respond to all Show IH comments
   - Post second Twitter thread (tomorrow morning)
   - Prepare cold email batch 1

3. **Document Learnings**:
   - What worked best (source of signups)
   - What objections came up
   - Product changes requested

---

**Remember:** Week 1 is about learning, not perfection. Every signup tells you something valuable about your target market.

**Good luck! You've got this. 🚀**

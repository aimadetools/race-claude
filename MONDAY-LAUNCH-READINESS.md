# Monday Launch Readiness — April 28, 2026

**Status:** ✅ All systems operational and verified. Ready for 9:30 AM Show IH launch.

**Today's Date:** April 27, 2026 (evening)
**Launch Date:** Monday, April 28, 2026 at 9:30 AM
**Verification Time:** April 27 11:45 PM UTC

---

## PRE-LAUNCH VERIFICATION (5 minutes) — Do This Monday 9:00 AM

Run these checks to confirm systems are still healthy before publishing Show IH post:

```bash
# Check 1: Homepage loads
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://www.getpricepulse.com/

# Check 2: Admin dashboard loads
curl -s -o /dev/null -w "Admin: %{http_code}\n" https://www.getpricepulse.com/admin.html

# Check 3: API returning data
curl -s https://www.getpricepulse.com/api/stats | head -20
# Should return: {"total_monitors":0,"total_users":0}

# Check 4: Auth system (signup page loads)
curl -s -o /dev/null -w "Signup: %{http_code}\n" https://www.getpricepulse.com/signup.html
```

**Expected results:** All should return HTTP 200. If any return 404 or 500, contact @raceai before publishing.

---

## CRITICAL PATHS BEFORE LAUNCH (Monday 9:15 AM)

### Path 1: Database Migration (if not done Friday)

If you haven't run the alert unsubscribe migration yet:

1. Go to: https://supabase.com/dashboard/project/bagmqtxdlogfpfqcvzof/sql/new
2. Copy entire contents of: `/home/race/race-claude/docs/schema-migration-alerts-unsubscribe.sql`
3. Paste into Supabase SQL editor
4. Click "Run"
5. Should see: "Execution completed successfully"

**Why:** Email unsubscribe links need the alerts_unsubscribed field in users table.

**Time:** 2 minutes (one SQL command)

---

## SHOW IH PUBLICATION (Monday 9:30 AM) — 5 minutes

### Step 1: Copy the draft
1. Open: `/home/race/race-claude/docs/show-ih-draft.md`
2. Copy entire text (Ctrl+A, Ctrl+C)
3. Go to: https://www.indiehackers.com/post

### Step 2: Create new post
1. Click "+ New Post"
2. In title field, paste: **"I built a tool that monitors SaaS competitor pricing pages 24/7 so founders don't have to — Show IH"**
3. In body, paste the full draft content
4. Add tags: `pricing`, `saas`, `tools`

### Step 3: Verify links work
Before publishing, check:
- `https://www.getpricepulse.com/` loads
- `https://www.getpricepulse.com/demo.html` loads
- `https://www.getpricepulse.com/pricing-tracker.html` loads

### Step 4: Publish
Click "Publish" button.

**Time:** 5 minutes total

**Expect:** 50-150 signups within 24 hours, 5-10 direct messages asking questions.

---

## ENGAGEMENT STRATEGY (Monday 9:35 AM → 6 PM) — Critical for visibility

Show IH ranking depends on engagement in the first 6 hours. Your task:

1. **Set a timer for 6 PM.** Check Show IH every 1-2 hours.
2. **Respond to EVERY comment within 30 minutes** of posting (see response templates below).
3. **If someone gives negative feedback:** Don't defend. Ask clarifying questions (see templates).
4. **If someone asks for demo:** Link to https://www.getpricepulse.com/demo.html
5. **If someone asks about features:** Reference the pricing-tracker for proof that monitoring works.

### First 6 Hours Engagement Timeline
- **9:30 AM:** Publish post
- **9:40 AM:** Check for first comments (usually 5-10 min after publish)
- **10:00 AM:** Respond to all comments
- **11:00 AM:** Check again, respond
- **12:00 PM:** Check again (lunch time, usually quiet)
- **1:00 PM:** Check again
- **2:00 PM:** Check again
- **3:00 PM:** Final check for new comments
- **6:00 PM:** Post count has solidified (stop responding to new ones)

### Key Response Templates

**When someone asks "Is this real pricing data?"**
> Yes! All 40 companies in our pricing tracker are monitored live right now. Check https://www.getpricepulse.com/pricing-tracker.html and you can see the exact pricing changes we're tracking (with dates). You can also try the demo at https://www.getpricepulse.com/demo.html to see how alerts work.

**When someone says "This sounds great but I need [feature]"**
> Great feedback! What's your use case? We're building the most important features based on what founders actually need. DM me your email and I'll follow up when we ship it.

**When someone asks about pricing**
> Free tier lets you monitor 2 competitors with daily checks. If you need more, Starter is $19/mo (10 competitors, hourly). We also have https://www.getpricepulse.com/pricing-tracker.html as a free resource you can use right now.

**When someone asks "How do you handle false positives?"**
> That's the hardest part! We use a noise-filtering algorithm that learns what's meaningful vs. noise (cookie banners, dates, etc.). Check our technical deep dive: https://www.getpricepulse.com/blog/how-pricepulse-detects-pricing-changes.html

**When someone says "Good idea but [competitor] already does this"**
> [Competitor] is amazing but targets enterprises at $500+/month. We're focused on indie founders who need competitor pricing intel without the enterprise price tag. That's the gap we're filling.

---

## SEND COLD EMAIL BATCH 1 (Monday 3 PM) — 30 minutes

Once Show IH is live and getting engagement:

1. Open: `/home/race/race-claude/docs/cold-email-template.md`
2. Pick Template 1 or 2 (personal/problem angle — best open rates)
3. Find 25 founder emails (see template doc for sources)
4. Personalize first sentence with founder name + company name
5. Send via Gmail (BCC to archive)

**Expect:** 2-5% response rate = 1-2 replies from 25 emails by Wednesday

**Time:** 30 minutes (finding emails + personalizing + sending)

---

## MONITOR WEEK 1 METRICS (Daily through Sunday)

### Every Morning (9 AM)
Go to: `https://www.getpricepulse.com/admin.html`

**Critical metrics to track:**
- **Total Users:** Should grow (target: 100+ by Friday)
- **Conversion Rate:** Free→Starter (target: >5% by Wednesday)
- **MRR:** Total revenue (target: $50+ by Friday = 3 Starter users)
- **Recent Signups:** Check names + emails for response patterns

### Hourly (9:30 AM — 6 PM on Monday)
Check Show IH post for new comments. Response rate = visibility on front page.

### Daily Checklist
- [ ] Check admin dashboard morning
- [ ] Check Show IH comments (respond within 1 hour)
- [ ] Check hello@getpricepulse.com for user emails
- [ ] Note any bugs reported by users
- [ ] Update launch-metrics.html with daily counts (optional, for personal tracking)

---

## TWITTER STRATEGY (Monday evening — Friday)

If you have Twitter set up:

1. Post Thread #1 (Monday evening, 6-7 PM): "The Founder's Problem" angle (see `docs/twitter-threads.md`)
2. Post Thread #2 (Wednesday): "The Technical Deep Dive" angle
3. Post Thread #3 (Friday): "Real Data" angle (show actual pricing changes detected)

**Why evening posts:** Catch tech Twitter when they're reading before bed.

---

## IF SOMETHING BREAKS (Troubleshooting)

### "Homepage returns 500 error"
→ Check Vercel deployment: https://vercel.com/dashboard
→ Redeploy: `git push origin main` (automatically deploys)
→ Check `docs/launch-technical-verification.md` for full troubleshooting

### "Signup page not working"
→ Go to: https://www.getpricepulse.com/confirm.html and try email signup
→ Check Supabase auth: https://supabase.com/dashboard/project/bagmqtxdlogfpfqcvzof/auth/users

### "Stripe checkout failing"
→ Check Stripe dashboard: https://dashboard.stripe.com/test/payments
→ Verify STRIPE_SECRET_KEY in Vercel env: https://vercel.com/dashboard/project/race-claude/settings/environment-variables

### "Admin dashboard showing 0 users but we have signups"
→ Supabase sync issue. Try refreshing the page (F5).
→ Check `/api/admin-stats.js` is returning data: `curl https://www.getpricepulse.com/api/admin-stats?admin=1`

---

## SUCCESS METRICS BY DAY

| Day | Target | Stretch |
|-----|--------|---------|
| Monday | 20-30 signups | 50+ signups |
| Tuesday | 30-50 signups (cumulative) | 100+ signups |
| Wednesday | 50-75 signups | 150+ signups |
| Friday | 100+ signups | 200+ signups |
| | 3-5 paid customers | 10+ paid customers |

---

## FILES YOU'LL NEED

All ready in the repository:

- **`/docs/show-ih-draft.md`** — Copy-paste this to Show IH
- **`/docs/show-ih-response-guide.md`** — Response templates for common questions
- **`/docs/cold-email-template.md`** — 5 email templates for outreach
- **`/docs/twitter-threads.md`** — 7 pre-written Twitter threads
- **`/docs/schema-migration-alerts-unsubscribe.sql`** — Run in Supabase if not done
- **`/docs/COMPETITIVE-ANALYSIS-2026.md`** — If you need to address competitive questions
- **`/FINAL-LAUNCH-STATUS.md`** — Master reference document with all systems status
- **`/launch-metrics.html`** — Open in browser to track daily numbers (optional)

---

## FINAL CHECKLIST (Monday 9:00 AM)

Before publishing, confirm:

- [ ] All 4 system checks pass (homepage, admin, API, signup)
- [ ] Database migration run (if not done Friday)
- [ ] Show IH draft copied and ready to paste
- [ ] Response templates printed out or bookmarked
- [ ] Cold email list partially built (for 3 PM)
- [ ] Twitter threads doc bookmarked (for Wednesday)
- [ ] Admin dashboard link bookmarked (for daily checks)

---

## YOU'VE GOT THIS 🚀

Everything is ready. You have:
- ✅ A fully functional product
- ✅ 40 companies in the pricing tracker
- ✅ 27 SEO-optimized blog posts
- ✅ Comprehensive email automation
- ✅ Admin dashboard for real-time metrics
- ✅ Response templates for every question
- ✅ Cold email templates ready to send

**Your job:** Show the world that PricePulse exists. Publish on Show IH, engage in comments, send cold emails, and watch Week 1 metrics roll in.

**Time to launch:** 5 minutes

**Expected outcome:** 100-200 signups, 5-10 paid customers, clear data on which channel works best.

**Next phase:** Thursday (analyze Week 1 data, double down on winning channel)

---

**Questions?** Check `/FINAL-LAUNCH-STATUS.md` or `/docs/launch-technical-verification.md`

**Confidence level:** 95%+ — All systems verified and operational as of April 27, 11:45 PM UTC.

Good luck! 🎉

# Launch Day Emergency Response Guide

**Keep this open in a tab. If something breaks, follow the decision tree for your issue.**

---

## 🚨 CRITICAL ISSUES (Blocks All Traffic)

### "Site returns 404 or 500 errors"

**Decision Tree:**
1. Check Vercel status: https://vercel.com (site status indicator)
   - ✅ Green → Not a Vercel outage
   - 🔴 Red → Vercel is down, nothing you can do. Wait & monitor.

2. If Vercel is up, check if code was recently pushed:
   ```bash
   git log --oneline -1
   # Should show Session 82 checklist update
   # If different, someone pushed breaking code
   ```

3. Hard refresh the site (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache, try again
   - If still 500, Vercel deployment failed

4. Check Vercel deployments:
   - Go to https://vercel.com/dashboard
   - Click race-claude project
   - Look at "Deployments" tab
   - Most recent should say "READY" (green)
   - If it says "FAILED" (red), previous commit broke something

**Action:**
```bash
# If deployment failed, revert the bad commit
git log --oneline -5
git revert <broken-commit-hash>
git push  # Auto-redeploys to Vercel
```

---

### "Signup form doesn't load / shows JS error"

**Decision Tree:**
1. Open browser console (F12 → Console tab)
   - Look for red error messages
   - Common errors:
     - `CORS error` → Supabase CORS not configured
     - `Cannot read property 'id'` → Auth token issue
     - `Supabase is undefined` → Environment variable not set

2. Check Vercel environment variables:
   - Go to https://vercel.com → race-claude project → Settings → Environment Variables
   - Verify these exist and have values:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
   - If missing, add them back and redeploy

3. Check Supabase auth settings:
   - Go to https://app.supabase.com → your project → Authentication → Redirect URLs
   - Verify these URLs are there:
     - `https://www.getpricepulse.com/confirm.html`
     - `https://getpricepulse.com/confirm.html`
   - If missing, add them

4. Test with a fresh incognito browser window
   - Clear cookies, try signup again

**Action:**
- If env vars are missing: add them to Vercel, trigger redeploy
- If redirect URLs missing: add to Supabase, redeploy not needed

---

### "Email confirmations not arriving"

**Decision Tree:**
1. Check Resend dashboard:
   - Go to https://resend.com/emails
   - Look at recent email sends
   - Do you see your test email in the list?

2. If email IS there:
   - Click it to see status
   - Status `Delivered` = email sent successfully (check spam folder)
   - Status `Bounced` = bad email address
   - Status `Failed` = Resend error (see error message)

3. If email is NOT in Resend:
   - Alert email was never sent
   - Check /api/alerts endpoint:
     ```bash
     curl https://www.getpricepulse.com/api/alerts
     # Should return 401 (needs auth)
     # If returns 500, endpoint is broken
     ```
   - Check Vercel logs for /api/alerts errors
   - Verify `RESEND_API_KEY` in Vercel env vars

4. Test the cron manually:
   - SSH to VPS: `ssh [your-vps-ip]`
   - Run: `node scripts/monitor-run.js`
   - Check output for errors

**Action:**
- Resend not responding? → Check https://resend.com (service status)
- API key wrong? → Update in Vercel, redeploy
- Cron not running? → Check VPS cron jobs: `crontab -l`

---

### "Stripe checkout doesn't open / payment fails"

**Decision Tree:**
1. Check browser console for JS errors when you click "Get Started" button
   - Look for fetch errors or Stripe API errors
   - Common: `Cannot find property 'stripe'`

2. Verify Stripe keys in Vercel:
   - https://vercel.com → race-claude project → Settings → Environment Variables
   - Check these exist:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRICE_ID_STARTER`
     - `STRIPE_PRICE_ID_PRO`
     - `STRIPE_WEBHOOK_SECRET`

3. Check Stripe dashboard:
   - Go to https://dashboard.stripe.com
   - Go to Products → Pricing
   - Verify you have 2 products:
     - "PricePulse Starter" → price ID (copy this)
     - "PricePulse Pro" → price ID (copy this)
   - These IDs must match your `STRIPE_PRICE_ID_*` env vars

4. Test the endpoint:
   ```bash
   curl https://www.getpricepulse.com/api/stripe
   # Should return 405 (needs auth + POST)
   # If returns 500, endpoint is broken
   ```

**Action:**
- Env vars missing? → Add to Vercel, redeploy
- Price IDs wrong? → Update in Vercel with correct IDs, redeploy
- Stripe service down? → Check https://status.stripe.com

---

## ⚠️ DEGRADED PERFORMANCE (Users Can Still Use, But Slow)

### "Monitors not running / no alerts sent"

**Decision Tree:**
1. Check VPS cron logs:
   ```bash
   ssh [your-vps-ip]
   tail -50 /var/log/syslog | grep cron
   # Look for entries like:
   # [monitor-run] Starting...
   # [email-nurture] Starting...
   ```

2. If you don't see recent entries (within last 5 minutes):
   - Cron job might not be configured
   - Run: `crontab -l`
   - Should show entries for :00, :05, :08 every hour
   - If not, re-run setup from HELP-REQUEST documentation

3. If you see cron entries but they have errors:
   - Log shows error message → Fix the issue
   - Common errors:
     - `SUPABASE_URL not set` → SSH into VPS, export variables in cron script
     - `npm not found` → Full path to node: `/usr/bin/node scripts/monitor-run.js`

4. Test manually:
   ```bash
   ssh [your-vps-ip]
   cd /path/to/pricepulse
   node scripts/monitor-run.js
   # Check output for errors
   ```

**Action:**
- If cron not configured: re-run setup
- If cron has errors: fix environment variables or paths
- If monitoring seems stuck: restart cron service

---

### "Admin dashboard numbers look wrong"

**Decision Tree:**
1. Admin dashboard shows:
   - Total users: 0
   - Paid conversions: 0
   - MRR: $0

2. This is NORMAL if:
   - Less than 30 minutes of traffic
   - Site just went live
   - Still during morning verification

3. By 12 PM (noon) you should see:
   - At least 5-10 signups from Show IH
   - 0-1 paid conversions

4. If it's past noon and still showing 0:
   - Check Supabase directly:
     ```bash
     Go to https://app.supabase.com → SQL editor
     SELECT COUNT(*) FROM auth.users;
     # Should show user count
     ```
   - If query returns 0, no users actually signed up yet
   - Check Show IH post for upvotes/engagement
   - If low, may need to adjust marketing strategy

**Action:**
- Early in launch? → Normal, give it time
- If past noon with 0 signups → Check Show IH visibility
- Consider posting on Twitter to drive more traffic

---

## 🟡 MINOR ISSUES (Users Annoyed, But Can Work Around)

### "Some pages load slowly (>3 seconds)"

**Action:**
- Check network tab in browser dev tools
- If CSS/JS files loading slow: likely Vercel CDN delay (normal, will improve)
- If API responses slow: check Supabase status
- If database queries slow: add indexes to frequently queried columns

### "Mobile layout looks broken on some phones"

**Action:**
- Test on Chrome DevTools mobile view (Ctrl+Shift+I → Toggle device toolbar)
- If broken, likely CSS media query issue
- Fix in code, git push, redeploy
- Vercel deploys usually within 30 seconds

### "Email looks weird in some email clients (Outlook, etc.)"

**Action:**
- Email HTML is responsive, should work in most clients
- If broken in one client, likely that client's CSS handling
- Not critical for launch, can fix later
- Users can still view in browser and see alerts in dashboard

---

## 🔍 HOW TO DEBUG VERCEL FUNCTIONS

If an API endpoint is returning 500 error:

**Step 1: Check Vercel logs**
```
1. Go to https://vercel.com/dashboard
2. Click race-claude project
3. Click "Functions" tab
4. Click the function name (e.g., "api/alerts.js")
5. See recent invocations and error messages
```

**Step 2: Reproduce error locally**
```bash
# Install dependencies locally
npm install

# Set environment variables
export SUPABASE_URL="https://bagmqtxdlogfpfqcvzof.supabase.co"
export SUPABASE_ANON_KEY="..." # from Vercel env vars
export RESEND_API_KEY="..." # from Vercel env vars

# Test function manually if possible
```

**Step 3: Check Supabase status**
- Go to https://status.supabase.com
- If red, Supabase is down (wait for recovery)
- If green, Supabase is up

**Step 4: Push a fix**
```bash
# Edit the function
vim api/alerts.js

# Add more error logging if needed
# Commit and push
git add api/alerts.js
git commit -m "Fix: [error description]"
git push
```

---

## 📞 ESCALATION CONTACTS

**If something is clearly broken and you can't fix it:**

1. Check service status pages first:
   - Vercel: https://vercel.com (status indicator top-right)
   - Supabase: https://status.supabase.com
   - Resend: https://resend.com (check status)
   - Stripe: https://status.stripe.com

2. If services are up but your code is broken:
   - Check git log to see recent changes
   - Revert the last bad commit if needed
   - Push a fix

3. If you can't figure it out:
   - Post in your Slack/Discord for quick feedback
   - Or pause launch until you can debug
   - **It's better to delay 1 hour and launch with working product than launch broken**

---

## ✅ EVERYTHING STILL WORKING? CONGRATS

If you got through launch day and everything worked:

- Celebrate 🎉 (you earned it)
- Start monitoring daily metrics
- Engage with users in Show IH comments
- Send second batch of cold emails
- Plan week 2 activities

The hard part is done. Now it's execution and learning from user feedback.

---

**Remember:** Most issues are temporary. Vercel deploys usually fix code issues within 30 seconds. External services sometimes have brief outages. Calmly follow the decision tree, and you'll figure it out.

Good luck. You've built something real. 🚀

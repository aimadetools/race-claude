# HELP REQUEST — Push 21 Uncommitted Sessions to Deploy

**What:** Push 21 sessions of code to GitHub so the site auto-deploys. The GitHub token lacks `workflow` scope and can't push due to a workflow file added in Session 162.

**Priority:** 🚨 CRITICAL — 21 sessions of work (133 pricing pages, Slack integration, price alerts, all new content) are NOT deployed. Users are seeing a 21-session-old version of the site.

**Time:** ~5 min

**Budget:** $0

---

## The Problem

The GitHub deploy token lacks `workflow` scope. Session 162 added `.github/workflows/price-alerts-email-nurture.yml`, which now blocks every push attempt with:
```
refusing to allow a Personal Access Token to create or update workflow files without `workflow` scope
```

The current live site is from May 4, 2026 (before Session 160). Sessions 160-166 are NOT deployed.

---

## TASK: Push the code

**Option A (easiest):** Add `workflow` scope to the existing GitHub Personal Access Token used by the race bot. Then run `git push` in the `/home/race/race-claude` directory.

**Option B:** From the `/home/race/race-claude` directory on the server, run:
```bash
git push
```
using credentials that have `workflow` scope (your personal GitHub account, or a new PAT with `workflow` scope).

**Option C:** If the workflow file is the only blocker, delete it and push:
```bash
cd /home/race/race-claude
git rm .github/workflows/price-alerts-email-nurture.yml
git commit -m "Remove workflow file (token scope fix)"
git push
```
Note: The email nurture cron can be re-added via cron-job.org instead.

---

## BONUS (if time allows, ~5 min):

Run the price alerts DB migration in Supabase SQL editor:
- File: `docs/schema-migration-price-alerts.sql`
- Paste the contents into Supabase Dashboard → SQL Editor → Run
- This enables the price alerts email signup form that's already deployed on 133 pages

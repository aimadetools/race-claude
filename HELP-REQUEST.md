# HELP-REQUEST.md

## Request 1: Domain — PLEASE PICK FROM THESE 5 ALTERNATIVES

`pricepulse.app` is taken. Here are 5 alternatives ranked by preference:

1. **`pricepulse.io`** — .io is the standard for SaaS tools, clean and professional ⭐ FIRST CHOICE
2. **`getpricepulse.com`** — "get" prefix makes it memorable, .com has best brand trust
3. **`pricepulse.dev`** — developer-focused, perfect for our audience
4. **`trypricepulse.com`** — "try" prefix converts well on landing pages
5. **`pricepulse.co`** — short and clean, widely accepted for startups

Please purchase whichever is available (preference order above) and point it at the Vercel deployment: `race-claude.vercel.app`. Also configure as a custom domain in Vercel.

Estimated cost: $10-15/year

---

## Request 2: Supabase Service Key — NEEDED FOR API

The Supabase anon key was provided (thank you!) but the server-side API (`/api/waitlist.js`) needs the **service_role key** to bypass RLS for system operations.

Please provide:
- `SUPABASE_SERVICE_KEY` — found in: Supabase Dashboard → Project Settings → API → `service_role` key (starts with `eyJ...`)

⚠️ This key should NEVER go in the HTML — only in Vercel environment variables.

---

## Request 3: Run Schema in Supabase — ONE-TIME SETUP

Please run the SQL in `docs/schema.sql` in the Supabase SQL editor to create all tables.

Steps:
1. Go to https://supabase.com/dashboard/project/bagmqtxdlogfpfqcvzof
2. Click "SQL Editor" in the left sidebar
3. Paste the contents of `docs/schema.sql` and click "Run"

This creates: waitlist, subscriptions, monitors, snapshots, diffs, alert_configs, alerts tables.

---

## Request 4: Vercel Environment Variables — NEEDED FOR API TO WORK

Please add these environment variables to the Vercel project (`race-claude`):

Go to: Vercel Dashboard → race-claude → Settings → Environment Variables

Add these for **Production** (and optionally Preview):

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://bagmqtxdlogfpfqcvzof.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ21xdHhkbG9nZnBmcWN2em9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NTUyNDUsImV4cCI6MjA5MjIzMTI0NX0.IBJsZkJE-NtR03AnJrqAYuH59VFyjl7p60HaluBDGL0` |
| `SUPABASE_SERVICE_KEY` | *(provide from Request 2 above)* |
| `CRON_SECRET` | *(generate any random 32-char string, e.g. use: `openssl rand -hex 16`)* |

Once these are set, redeploy (or push any commit) and the waitlist form and auth will work end-to-end.

---

## Request 5: Supabase Auth Redirect URL — ONE-TIME CONFIG

For email confirmation to land on the right page, configure Supabase Auth redirect URLs:

1. Go to: https://supabase.com/dashboard/project/bagmqtxdlogfpfqcvzof/auth/url-configuration
2. Set **Site URL** to: `https://race-claude.vercel.app` (or the custom domain once available)
3. Add to **Redirect URLs**: `https://race-claude.vercel.app/confirm.html`

Without this, clicking the confirmation email link will fail. Takes 2 minutes.

---

## Summary of Requests

| # | What | Why | Time est. |
|---|------|-----|-----------|
| 1 | Domain purchase | Custom domain for brand | 10 min |
| 2 | Supabase service key | Server-side API auth | 2 min |
| 3 | Run schema.sql | Create database tables | 5 min |
| 4 | Vercel env vars | Make API endpoints live | 5 min |
| 5 | Supabase Auth redirect URL | Email confirmation works | 2 min |

Total: ~24 minutes. This unblocks EVERYTHING — waitlist capturing, auth, monitoring engine.

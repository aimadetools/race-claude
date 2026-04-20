# HELP-REQUEST.md

Human helper — please complete these tasks. Update each item with the result when done.

---

## Request 1: Buy domain `pricepulse.app`

**Status:** PENDING

**What:** Register the domain `pricepulse.app`

**Steps:**
1. Go to Namecheap (or Cloudflare Registrar — cheaper renewals)
2. Search for `pricepulse.app`
3. Purchase for 1 year (~$14-16)
4. Set nameservers to Vercel's (we'll connect it after): `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
5. Update this file with the registrar used and confirmation

**If pricepulse.app is taken:** Try `pricepulse.io` (up to $30) or `getpricepulse.com` (under $15). Update IDENTITY.md with whatever domain was registered.

**Time:** 10 minutes
**Budget:** Under $20 from the $90
**Priority:** Important (not blocking launch, but needed before Product Hunt)

**Result:** _(human fills this in)_

---

## Request 2: Create Supabase project

**Status:** PENDING

**What:** Create a new Supabase project for PricePulse

**Steps:**
1. Go to supabase.com, sign in (or create account)
2. Create new project named `pricepulse`
3. Choose region: US East (or closest to target users)
4. Set a strong database password and save it somewhere safe
5. Go to Project Settings → API
6. Copy: `Project URL` and `anon public` key
7. Update this file with those values (below)
8. Also create a `.env.local` file in the repo root with:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

**Time:** 10 minutes
**Budget:** $0 (free tier)
**Priority:** Blocking — needed to replace localStorage email capture with real storage

**Result:**
- Supabase URL: _(human fills this in)_
- Anon key added to .env.local: _(yes/no)_

---

## Request 3: Connect repo to Vercel

**Status:** PENDING

**What:** Deploy the site to Vercel from this GitHub repo

**Steps:**
1. Go to vercel.com, sign in
2. Click "Add New Project"
3. Import from GitHub: select this repo (`race-claude`)
4. Framework preset: "Other" (static HTML)
5. Build command: leave empty
6. Output directory: leave as default (root)
7. Deploy
8. Once deployed, add the custom domain (if purchased): pricepulse.app
9. Update this file with the Vercel URL

**Time:** 10 minutes
**Budget:** $0 (Vercel free tier)
**Priority:** Blocking — site needs to be live to collect signups

**Result:**
- Vercel URL: _(human fills this in)_
- Custom domain connected: _(yes/no)_

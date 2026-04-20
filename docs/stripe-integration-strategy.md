# [P4] Stripe Integration Strategy

**Status:** DESIGNED
**Priority:** HIGH (blocks revenue, week 3-4)
**Audience:** Developers implementing payments in week 3

---

## Executive Summary

PricePulse monetizes through Stripe Checkout. Users upgrade from Free → Starter ($19/mo) or Pro ($49/mo) on the pricing page. The flow:

1. User clicks "Upgrade" button → Stripe Checkout session created
2. User completes payment
3. Stripe webhook fires → subscription record created in Supabase
4. User redirected to dashboard with upgraded plan
5. Plan limits enforced in app logic (monitors, frequency)

**Key insight:** Stripe manages subscriptions; Supabase mirrors them. App logic owns enforcement.

---

## Architecture Overview

### Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (HTML Pages)                                           │
├─────────────────────────────────────────────────────────────────┤
│ pricing.html → "Upgrade" button (Free/Starter) & "Plan select"  │
│ dashboard.html → "Upgrade plan →" button                        │
│ plan-select.html → ALREADY ROUTED to pricing on plan select     │
└────────────────────────┬────────────────────────────────────────┘
                         │ POST /api/stripe-checkout
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend: api/stripe-checkout.js                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Auth check (Bearer token in Authorization header)            │
│ 2. Validate planId ∈ {starter, pro}                             │
│ 3. Validate userEmail                                           │
│ 4. Create Stripe Checkout Session                               │
│ 5. Return { url: session.url }                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ Redirect to session.url
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Stripe Hosted Checkout Page                                      │
├─────────────────────────────────────────────────────────────────┤
│ User enters card, completes payment                              │
│ Stripe creates subscription (recurring billing)                  │
│ Stripe sends webhook to /api/stripe-webhook                     │
└────────────┬───────────────────────────────────┬────────────────┘
             │                                    │
          success                              cancel
             │                                    │
             ↓                                    ↓
    success_url: /dashboard                /pricing?checkout=cancelled
    ?session_id={CHECKOUT_SESSION_ID}
```

### Database (Supabase)

**subscriptions table** (mirrors Stripe):
```sql
id                    uuid PRIMARY KEY
user_id              uuid → FOREIGN KEY users(id)
stripe_customer_id   text UNIQUE
stripe_subscription_id text UNIQUE
stripe_price_id      text              -- STRIPE_PRICE_ID_STARTER or _PRO
plan                 text              -- 'starter' | 'pro'
status               text              -- 'active' | 'past_due' | 'cancelled'
current_period_end   timestamp         -- next billing date
created_at          timestamp
updated_at          timestamp
```

**Key:** Records are **upserted** by webhook (no duplicate subscriptions).

---

## Implementation Steps

### Phase 1: Stripe Account & Pricing Setup (Human)

1. **Create Stripe account** (free)
   - Go to stripe.com → sign up
   - Verify email, confirm business details
   - **Save:**
     - Publishable key (starts `pk_`)
     - Secret key (starts `sk_`) ← KEEP SECRET

2. **Create pricing in Stripe Dashboard**
   - **Starter:** $19/month (recurring)
   - **Pro:** $49/month (recurring)
   - **Save:**
     - Price ID for Starter (e.g., `price_1Nt...`)
     - Price ID for Pro (e.g., `price_1Nu...`)

3. **Set webhook endpoint**
   - Stripe Dashboard → Webhooks
   - Endpoint URL: `https://pricepulse.app/api/stripe-webhook`
   - Events to receive:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - **Save:** Webhook secret (signing key)

---

### Phase 2: Environment Variables Setup

Add to `.env.local` (or Vercel deployment settings):

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...              # Secret key from Stripe
STRIPE_PRICE_ID_STARTER=price_1Nt...       # Starter price ID
STRIPE_PRICE_ID_PRO=price_1Nu...           # Pro price ID
STRIPE_WEBHOOK_SECRET=whsec_...            # Webhook signing secret

# Checkout endpoint auth
CHECKOUT_SECRET=<generate-random-string>   # Random bearer token for /api/stripe-checkout
APP_URL=https://pricepulse.app             # Base URL (for redirect URLs)

# Supabase (already set up)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
```

**Why `CHECKOUT_SECRET`?**
Prevents anyone from calling `/api/stripe-checkout` with arbitrary emails. Frontend must know this secret to upgrade users. (Later: replace with user auth token validation.)

---

### Phase 3: Frontend Integration

#### pricing.html

**Starter button:**
```html
<button class="btn btn-primary" onclick="handleUpgrade('starter')">
  Upgrade to Starter →
</button>
```

**Pro button:**
```html
<button class="btn btn-primary" onclick="handleUpgrade('pro')">
  Upgrade to Pro →
</button>
```

**JavaScript:**
```javascript
async function handleUpgrade(planId) {
  const user = await getCurrentUser(); // Supabase Auth
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html?redirect=pricing.html';
    return;
  }

  try {
    const response = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHECKOUT_SECRET}` // Must get from frontend env
      },
      body: JSON.stringify({
        planId: planId,
        userEmail: user.email
      })
    });

    if (!response.ok) {
      alert('Could not start checkout. Please try again.');
      return;
    }

    const { url } = await response.json();
    window.location.href = url; // Redirect to Stripe Checkout
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Network error. Please try again.');
  }
}
```

**Problem:** `CHECKOUT_SECRET` cannot be stored in frontend code (it's a secret!).
**Solution (for now):** Backend-only auth. Frontend doesn't need to know the secret; the auth happens server-side when the API is called. Remove the `Authorization` header from frontend and validate differently.

**Revised:** The `/api/stripe-checkout.js` should validate the **user's session** instead:
- Extract user ID from Supabase session
- Verify user is logged in
- Only allow checkout for that user's email

#### dashboard.html

**"Upgrade plan →" button** already exists; add `onclick` handler:
```javascript
function upgradeFromDashboard() {
  window.location.href = 'pricing.html#upgrade-pro'; // Jump to Pro section
}
```

#### plan-select.html

**"Upgrade to Starter" / "Upgrade to Pro"** buttons:
- Same `handleUpgrade()` flow as pricing.html

---

### Phase 4: Backend Implementation

#### /api/stripe-checkout.js (REVISED)

```javascript
/**
 * POST /api/stripe-checkout
 *
 * Creates a Stripe Checkout Session for a given plan.
 * Auth: Supabase session token (Bearer token in Authorization header)
 *
 * Request body:
 *   { planId: 'starter' | 'pro' }
 *
 * Response:
 *   200 { url: string }   — Checkout Session URL
 *   401                   — Not authenticated or session invalid
 *   400                   — Missing / invalid request body
 *   500                   — Stripe API error
 */

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const PLAN_PRICE_MAP = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

async function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Auth: Validate Supabase session ──────────────────────────────────────────
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Verify token with Supabase
  const supabase = await getSupabase();
  const { data, error: authError } = await supabase.auth.getUser(token);

  if (authError || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const user = data.user;
  const userEmail = user.email;

  // ── Input validation ─────────────────────────────────────────────────────────
  const { planId } = req.body || {};

  if (!planId) {
    return res.status(400).json({ error: 'planId is required' });
  }

  const priceId = PLAN_PRICE_MAP[planId];
  if (!priceId) {
    return res
      .status(400)
      .json({ error: `Unknown planId "${planId}". Valid values: starter, pro` });
  }

  // ── Create Checkout Session ──────────────────────────────────────────────────
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const baseUrl = process.env.APP_URL || 'https://pricepulse.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      metadata: {
        userId: user.id,
        planId,
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[stripe-checkout] Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
```

#### /api/stripe-webhook.js (ALREADY DONE)

Receives webhook events and updates `subscriptions` table. No changes needed — it's already solid.

---

### Phase 5: Free → Paid Upgrade Flow (in plan-select.html)

When user selects a paid plan after email confirmation:

```javascript
async function selectPlan(planId) {
  const user = getCurrentUser(); // Supabase

  if (planId === 'free') {
    // No payment needed; update subscription record
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: 'free',
        status: 'active',
        stripe_customer_id: null, // No Stripe customer for free
        stripe_subscription_id: null,
      }, { onConflict: 'user_id' });

    if (error) {
      alert('Could not set plan. Please try again.');
      return;
    }

    window.location.href = 'first-monitor.html';
  } else {
    // Paid plan: redirect to Stripe Checkout
    handleUpgrade(planId); // Calls /api/stripe-checkout
  }
}
```

---

### Phase 6: Subscription Status in Dashboard

Dashboard reads `subscriptions` table:

```javascript
// dashboard.html — init()
const { data: sub, error: subError } = await supabase
  .from('subscriptions')
  .select('plan, status')
  .eq('user_id', userId)
  .single();

currentPlan = sub?.plan || 'free';
currentStatus = sub?.status || 'active'; // past_due, cancelled, etc.

// Enforce plan limits
const limits = { free: 2, starter: 10, pro: Infinity };
const maxMonitors = limits[currentPlan] || 2;

// Disable upgrade button if already on a higher plan
if (currentPlan !== 'free') {
  document.getElementById('upgradeBtnArea').style.display = 'none';
}
```

---

### Phase 7: Handling Edge Cases

#### User cancels checkout
- Stripe redirects to `/pricing?checkout=cancelled`
- Show banner: "Checkout cancelled. Try again or contact support."
- No database changes

#### Payment fails → past_due
- Webhook handler marks subscription `status: 'past_due'`
- Dashboard shows warning: "Payment failed. Update your card."
- App restricts new checks but doesn't delete existing monitors
- User has 7 days to retry before cancellation

#### User downgrades (Free → Free, or Starter → Free)
- User clicks "Cancel subscription" button (add to account page)
- Calls POST `/api/cancel-subscription` (validate user owns subscription)
- Supabase marks `status: 'cancelled'`, plan stays 'free' (after billing period)
- Dashboard immediately restricts plan to 2 monitors

#### Stripe webhook delivery fails
- Stripe retries webhook delivery (up to 3 days)
- App should log failures and alert admin
- Manual fix: run webhook handler again with Stripe CLI

---

## Files to Create/Modify

### New Files

1. **`docs/stripe-integration-strategy.md`** (this file)
   - Comprehensive design for all stakeholders

2. **`docs/stripe-price-setup.md`**
   - Step-by-step Stripe Dashboard walkthrough
   - Screenshots of creating products, prices, webhooks
   - Save: pricing IDs, keys, webhook secret

3. **`docs/env-setup-stripe.md`**
   - Environment variable checklist
   - How to set vars in Vercel deployment

### Modified Files

1. **`api/stripe-checkout.js`**
   - Replace Bearer token auth with Supabase session validation
   - Add `metadata.userId` to track which user initiated checkout
   - Add logging for debugging

2. **`pricing.html`**
   - Add `onclick="handleUpgrade('starter')"` and `handleUpgrade('pro')` to buttons
   - Add JavaScript `handleUpgrade()` function
   - Update button text if already on that plan

3. **`plan-select.html`**
   - Add plan selection UI (if not already present)
   - "Upgrade to Starter" / "Upgrade to Pro" buttons call `handleUpgrade()`
   - "Continue with Free" button for Free plan

4. **`dashboard.html`**
   - Load current plan from `subscriptions` table
   - Show "Upgrade plan →" button if not Pro
   - Update `updatePlanBanner()` to read from DB

5. **`.env.local` (local) / Vercel settings (production)**
   - Add all Stripe env vars

---

## Success Metrics

- ✅ User can click "Upgrade" → Stripe Checkout session created
- ✅ Payment completion → Stripe webhook fires
- ✅ Webhook creates subscription record in Supabase
- ✅ Dashboard shows user's current plan
- ✅ Plan limits enforced (2/10/unlimited monitors)
- ✅ Payment failure → subscription marked past_due
- ✅ Cancellation → subscription marked cancelled

---

## Security Considerations

1. **Stripe API Key**
   - NEVER commit to git (use `.env.local`, Vercel secrets)
   - Use environment-based config

2. **Webhook Signature Verification**
   - Always verify `stripe-signature` header
   - Use `stripe.webhooks.constructEvent()`
   - NEVER trust webhook body without verification

3. **Session Tokens**
   - Supabase tokens are short-lived (1 hour)
   - Frontend refreshes automatically
   - Backend validates token before creating checkout session

4. **CORS**
   - `/api/stripe-checkout` is called from frontend
   - Set `Access-Control-Allow-Origin: *` or restrict to domain
   - Content-Type: application/json

---

## Testing Checklist

### Local (before production)

- [ ] Create Stripe test account
- [ ] Create test Stripe products/prices
- [ ] Test `/api/stripe-checkout` with valid user token
- [ ] Test `/api/stripe-checkout` with invalid token → 401
- [ ] Use Stripe test card `4242 4242 4242 4242` to simulate payment
- [ ] Verify webhook fires locally (use `stripe listen` CLI)
- [ ] Verify webhook creates subscription record
- [ ] Verify dashboard reads plan from subscriptions table

### Production (after launch)

- [ ] Test with live Stripe account
- [ ] Test full user flow: signup → plan select → checkout → dashboard
- [ ] Verify webhook delivery in Stripe Dashboard
- [ ] Test payment failure flow (use test card `4000 0000 0000 0002`)
- [ ] Test cancellation workflow

---

## Timeline

- **Week 3, Day 1:** Stripe account setup (human)
- **Week 3, Day 2-3:** Implement checkout + webhook handlers
- **Week 3, Day 4:** Integrate into pricing.html, plan-select.html, dashboard.html
- **Week 3, Day 5:** Testing (local + staging)
- **Week 4, Day 1:** Production deployment

---

## Notes

- Stripe Checkout is **hosted** (Stripe manages the form, no PCI compliance burden)
- Recurring subscriptions are **managed by Stripe** (we just mirror in Supabase)
- Webhooks are the **source of truth** for subscription status
- Free tier users have **no Stripe record** (nullable fields in DB)

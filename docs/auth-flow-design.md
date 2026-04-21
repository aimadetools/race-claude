# [P3] Auth Flow Design — Complete Architecture

**Status:** Design complete, ready for implementation
**Priority:** CRITICAL (blocking revenue)
**Timeline:** Week 2

---

## Overview

Complete auth flow for PricePulse: signup → email confirmation → plan selection → first monitor setup → authenticated dashboard.

**Design goals:**
- Zero friction for free tier conversion
- Clear upgrade path from Free → Starter → Pro
- Trial/paid transition is seamless
- Free tier limits are enforced at app logic level (not schema)
- Session persistence across page reloads
- Email-based recovery flows (forgot password, resend confirmation)

---

## Phase 1: Signup Flow

### 1a. Signup Form (`signup.html`)

**Current state:** Email + password form exists, Supabase Auth integration skeleton in place.

**Implementation:**
- Form fields:
  - Email (required, validated)
  - Password (required, min 8 chars, show/hide toggle recommended)
- Validation:
  - Email: RFC 5322 compliant (Supabase validates)
  - Password: min 8 chars, no other rules (easy to remember for indie founders)
- Error handling:
  - "Email already exists" → link to login
  - "Password too weak" → specific guidance
  - Network errors → retry button
- Success state:
  - Hide form
  - Show "Check your email" message with email address
  - Provide "resend" link (rate-limited, e.g. 1 per minute)

**Supabase integration:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password
});
// On success: Supabase sends confirmation email automatically
// No manual DB insert needed yet (user not confirmed)
```

---

### 1b. Email Confirmation Link

**How it works:**
1. User clicks confirmation link in email
2. Link contains `type=signup` token
3. Supabase redirects to `confirm.html?token=xyz`
4. `confirm.html` calls `supabase.auth.verifyOtp()`
5. On success: user is confirmed, redirect to plan selection

**Flow diagram:**
```
signup.html (enter email)
    ↓
(Supabase sends confirmation email)
    ↓
User clicks link in email
    ↓
confirm.html (verify OTP with Supabase)
    ↓
Success: Create user in subscriptions table
    ↓
Redirect to plan-select.html
```

**Implementation notes:**
- Confirmation links are valid for 24 hours (Supabase default)
- `confirm.html` needs to:
  - Extract token from URL (`?type=signup&token=xyz`)
  - Call `supabase.auth.verifyOtp()`
  - On error: show "Link expired, request a new one" + resend form
  - On success: show "Account activated!" then redirect after 2 seconds
- Link format: `https://getpricepulse.com/confirm.html?type=signup&token=xxx`

**Create `confirm.html`:**
```html
<!-- Basic layout: center, confirm icon, message, spinner during verification -->
<h1>Activating your account...</h1>
<p id="message">Please wait...</p>
<button id="resendBtn" style="display:none">Resend confirmation</button>

<script>
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const type = params.get('type') || 'signup';

  (async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type,
      token: token
    });

    if (error) {
      document.getElementById('message').textContent =
        'Link expired or invalid. Request a new confirmation email.';
      document.getElementById('resendBtn').style.display = 'block';
    } else {
      // Account confirmed, create user profile
      await createUserProfile(data.user.id, data.user.email);
      document.getElementById('message').textContent = 'Account activated! Redirecting...';
      setTimeout(() => window.location.href = 'plan-select.html', 2000);
    }
  })();
</script>
```

---

## Phase 2: Plan Selection

### 2a. Plan Selection Page (`plan-select.html`)

**When does user see this?**
- Immediately after email confirmation
- New users, before they create any monitors
- Can skip and go back later (land on Free tier)

**What to show:**
- 3 pricing tiers: Free, Starter ($19/mo), Pro ($49/mo)
- Feature grid (competitors count, frequency, alerts, API)
- "Continue with Free" button (no payment required)
- "Upgrade to Starter" button (redirects to Stripe Checkout)
- "Upgrade to Pro" button (redirects to Stripe Checkout)

**Behavior:**
- Clicking "Continue with Free":
  - Update `subscriptions.plan = 'free'` in DB
  - Redirect to first-monitor setup
- Clicking "Upgrade to Starter/Pro":
  - Redirect to Stripe Checkout
  - Checkout session pre-fills user email
  - On success, webhook updates `subscriptions.plan` + `current_period_end`
  - Redirect to first-monitor setup

**Conditional display:**
```javascript
// Only show "Upgrade" buttons if Stripe is configured
if (STRIPE_CHECKOUT_ID) {
  // Show buttons
} else {
  // Show "Contact us for pricing" or hide tier
}
```

---

## Phase 3: First Monitor Setup

### 3a. First Monitor Onboarding (`first-monitor.html`)

**When does user see this?**
- Right after plan selection
- Guided onboarding (not dashboard yet)

**What to collect:**
1. Monitor name: "e.g., Notion pricing"
2. URL: competitor pricing page URL
3. Alert email: where to send alerts (default: signup email)
4. Check frequency: every 30min / 1h / 3h (depends on plan)

**Validation:**
- URL: must be valid URL, not localhost/internal IPs
- Name: 1-100 characters
- Frequency: must respect plan limits

**On submit:**
- Call `POST /api/monitors/create` with user_id, monitor data
- API creates monitor in DB with `next_check = NOW()`
- Redirect to dashboard with success message "Monitor created!"

**Plan limits:**
- Free: 2 monitors max, check every 24h
- Starter: 10 monitors max, check every hour
- Pro: unlimited, check every 30min

```javascript
async function createFirstMonitor(name, url, alertEmail, frequency) {
  const { data, error } = await fetch('/api/monitors/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      url,
      alert_email: alertEmail,
      frequency,
      user_id: currentUser.id
    })
  });

  if (data) {
    window.location.href = 'dashboard.html?onboarded=true';
  }
}
```

---

## Phase 4: Authenticated Session

### 4a. Session Persistence

**How users stay logged in:**

Supabase Auth handles sessions via:
1. Auth token stored in browser localStorage (auto, secure)
2. Session checked on page load
3. If session invalid: user redirected to login

**Implementation:**
```javascript
// On page load
const { data, error } = await supabase.auth.getSession();

if (!data.session) {
  window.location.href = 'login.html';
} else {
  // User is authenticated
  renderDashboard(data.session.user);
}
```

**Session refresh:**
- Supabase auto-refreshes tokens before expiry
- Manual refresh: `await supabase.auth.refreshSession()`

### 4b. Dashboard Access Control

**Protected routes:**
- `/dashboard.html` — requires active session
- `/settings.html` — requires active session
- `/monitor/[id]` — requires active session + ownership check
- `/api/monitors/*` — API key or session auth required

**Pattern for dashboard:**
```html
<script>
  window.addEventListener('load', async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = 'login.html?redirect=' + window.location.pathname;
    } else {
      // Initialize dashboard
      initializeDashboard(data.session.user);
    }
  });
</script>
```

---

## Phase 5: Upgrade & Trial Management

### 5a. Trial Period (Optional MVP, can be v2)

**Not in MVP.** Start with:
- Free forever (2 competitors)
- Starter paid ($19/mo)
- Pro paid ($49/mo)

**If adding trial later:**
- Add `trial_started_at` and `trial_ends_at` to subscriptions table
- Free tier = trial OR no payment method
- Trial users see "X days left" in dashboard

### 5b. Upgrade Prompt in Dashboard

**When to show upgrade prompt:**
- User on Free tier with 1 monitor: "Add another competitor?" button → upgrade prompt
- User on Free tier, tried to add 3rd monitor: "Upgrade to add more" modal
- User on Starter, tried to add 11th monitor: "Upgrade to Pro for unlimited"

**Upgrade flow:**
1. Click upgrade button
2. Modal with plan comparison
3. "Upgrade" button → Stripe Checkout
4. On success: refresh page, show "Plan upgraded!" toast

### 5c. Stripe Integration

**Checkout flow:**
```javascript
async function redirectToStripeCheckout(planId) {
  // planId = 'starter' or 'pro'
  const { sessionId } = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan: planId })
  }).then(r => r.json());

  // Redirect to Stripe Checkout
  await stripe.redirectToCheckout({ sessionId });
}
```

**Webhook handler (post-implementation):**
```javascript
// POST /api/webhooks/stripe
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const userId = session.client_reference_id;

  // Update subscriptions table
  await supabase
    .from('subscriptions')
    .update({
      plan: session.metadata.plan,
      stripe_customer_id: session.customer,
      current_period_end: calculatePeriodEnd(session.metadata.plan)
    })
    .eq('user_id', userId);
}
```

---

## Phase 6: Account Recovery & Security

### 6a. Login Flow

**Existing:** Email + password login in `login.html` (implemented)

**On success:**
- Store session in localStorage (Supabase does this)
- Redirect to dashboard

**On failure:**
- "Email or password incorrect" (generic for security)
- Link to forgot password

### 6b. Forgot Password Flow

**Existing:** `handleReset()` in `login.html` (implemented)

**Flow:**
1. User clicks "Forgot password?"
2. Modal/panel with email input
3. User submits email
4. Supabase sends reset link to email
5. Link goes to `reset-password.html?token=xyz`
6. User enters new password
7. `reset-password.html` calls `supabase.auth.updateUser({ password })`
8. On success: "Password reset! Redirecting to login..." → login.html

**Create `reset-password.html`:**
```html
<h1>Set a new password</h1>
<input type="password" id="newPassword" />
<button onclick="handlePasswordReset()">Set password</button>

<script>
  async function handlePasswordReset() {
    const newPassword = document.getElementById('newPassword').value;
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Password updated! Redirecting to login...');
      setTimeout(() => window.location.href = 'login.html', 2000);
    }
  }
</script>
```

### 6c. Resend Confirmation Email

**Existing:** `resendEmail()` in `signup.html` (implemented)

---

## Phase 7: User Profile & Settings

### 7a. Settings Page (`settings.html`)

**Available to logged-in users:**
- Email address (display only, for security)
- Current plan (Free / Starter / Pro)
- Upgrade / downgrade plan button
- Alert preferences (email for price ↑↓ / new plans)
- Delete account button (with confirmation)

**Upgrade/downgrade:**
- Downgrade Free → nothing (free forever)
- Upgrade Free → Starter/Pro → Stripe Checkout
- Downgrade Starter → Free: ask "Are you sure? You'll lose monitors #3+. Confirm?"

**Delete account:**
- Soft delete only in MVP (mark as inactive)
- Hard delete in v2 (after compliance review)

---

## Database Schema Integration

### User Creation on Signup Confirmation

When email is confirmed, create user profile in `subscriptions` table:

```sql
-- Triggered by successful email confirmation
INSERT INTO subscriptions (user_id, email, plan, created_at)
VALUES (
  auth.user.id,
  auth.user.email,
  'free',
  NOW()
);
```

### Free Tier Limit Enforcement

**In application logic (not DB):**
```javascript
async function createMonitor(userId, name, url) {
  // 1. Get user's plan
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();

  // 2. Count existing monitors
  const { data: existing } = await supabase
    .from('monitors')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  // 3. Check limits
  const limits = { free: 2, starter: 10, pro: null };
  const max = limits[sub.plan];

  if (max && existing.count >= max) {
    throw new Error(`Plan limit reached. Upgrade to add more.`);
  }

  // 4. Create monitor
  return await supabase
    .from('monitors')
    .insert({ user_id: userId, name, url, plan: sub.plan });
}
```

---

## Auth State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                     UNAUTHENTICATED                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  signup.html ────> confirm.html ────> plan-select.html     │
│       ↓                ↓                     ↓               │
│  (email+pass)    (verify OTP)       (choose plan)           │
│                                            ↓                │
│                                  first-monitor.html ────┐   │
│                                      ↓                 │   │
│                                  (add 1 monitor)       │   │
│                                                        ↓   │
│  login.html ──────────────────────────────────> dashboard.html
│      ↓                                                 ↑    │
│  (email+pass)                          [AUTHENTICATED]     │
└──────────────────────────────────────────────────────────────┘
       ↓
  (success)
       ↓
  forgot-password.html
       ↓
  reset-password.html
       ↓
  login again
```

---

## Environment Configuration

**Required env vars (`.env.local`):**
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
STRIPE_CHECKOUT_ID=cs_live_xxx  # (optional for MVP, payment in week 3)
```

**For HTML-only signup (no build step):**
```javascript
// signup.html, login.html, etc.
const SUPABASE_URL = 'SUPABASE_URL_PLACEHOLDER';
const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY_PLACEHOLDER';
// Replace at deploy time via Vercel env vars
```

---

## Files to Create/Modify

### New files:
1. `confirm.html` — Email confirmation landing page
2. `plan-select.html` — Plan selection (Free / Starter / Pro)
3. `first-monitor.html` — Add first monitor (onboarding)
4. `reset-password.html` — Password reset landing
5. `settings.html` — User settings (plan, email prefs, delete)
6. `api/monitors/create.js` — Vercel API route for monitor creation (with plan limit checks)
7. `api/auth/session.js` — Get current user session (helper endpoint)
8. `api/checkout.js` — Stripe checkout session creation (v2+, but skeleton now)

### Modify existing:
1. `signup.html` — Already implemented, just needs confirmation flow
2. `login.html` — Already implemented, just needs reset flow
3. `dashboard.html` — Add session check, render user's monitors
4. `index.html` — Modify nav: "Sign in / Start free" → check if user logged in, show email + logout
5. `package.json` — Already has Supabase, add Stripe client when ready

---

## Success Criteria

✅ User can sign up with email + password
✅ Confirmation email sent and verified
✅ User selects plan (Free / Starter / Pro)
✅ First monitor created successfully
✅ Session persists across page reloads
✅ Login works
✅ Forgot password works
✅ Free tier limited to 2 monitors (enforced in code)
✅ Starter tier shows "Upgrade to Pro" at 11 monitors
✅ Settings page shows current plan + upgrade button

---

## Implementation Order

1. **confirm.html** — After signup, email confirm links must work
2. **plan-select.html** — Route confirmed users to plan selection
3. **first-monitor.html** — Let users add their first monitor
4. **API route: POST /api/monitors/create** — Store monitors in DB
5. **dashboard.html** — Show user's monitors and alerts
6. **settings.html** — Plan info, email preferences
7. **reset-password.html** — Complete the forgot password flow
8. **Plan limit enforcement in API routes** — Reject monitor creation if limit reached
9. **Stripe integration skeleton** — Design ready, implement in week 3

---

## Notes

- All auth state is managed by Supabase (no manual session tokens)
- RLS policies in Supabase schema ensure users can only access their own data
- Email confirmation is required before dashboard access
- Free tier is permanent (no auto-downgrade from paid)
- Free tier has soft limits enforced in app code, not schema


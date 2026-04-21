# Analytics Tracking Setup — PricePulse

Simple client-side analytics for tracking user acquisition without external services.

---

## Goals

Track where users come from and what they do, so we can:
1. Measure which distribution channels work (Show IH, Twitter, cold email)
2. Calculate conversion rates (signup → paid)
3. Identify bottlenecks (where do users drop off?)
4. Make data-driven decisions on where to spend time next

---

## What We'll Track

### Tier 1: Essential (Must Have)

- **Page views** (which pages users visit)
- **Signups** (free tier conversions)
- **Upgrades** (free → paid conversions)
- **Traffic source** (where did they come from?)

### Tier 2: Nice-to-Have

- **Feature usage** (did they create a monitor? Get an alert?)
- **Time-to-first-action** (how long before they add a monitor?)
- **Device type** (mobile vs. desktop)
- **Referrer** (direct, organic, social, email, etc.)

---

## Implementation Plan (No External Tools)

### 1. UTM Parameters on All Links

Add UTM parameters to every link you publish:

**Format:** `https://getpricepulse.com?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]`

**Examples:**

**Show IH post:**
```
https://getpricepulse.com?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih
```

**Twitter thread:**
```
https://getpricepulse.com?utm_source=twitter&utm_medium=thread&utm_campaign=pricing_problem
```

**Cold email:**
```
https://getpricepulse.com/demo.html?utm_source=cold_email&utm_medium=email&utm_campaign=founder_outreach
```

**Product Hunt:**
```
https://getpricepulse.com?utm_source=product_hunt&utm_medium=post&utm_campaign=ph_launch
```

**Blog post CTA:**
```
https://getpricepulse.com?utm_source=blog&utm_medium=cta&utm_campaign=visualping_comparison
```

### 2. Store UTM in localStorage

Add this JavaScript to every page (index.html, pricing.html, etc.):

```javascript
// Track UTM parameters
function captureUTM() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'direct',
    campaign: params.get('utm_campaign') || 'direct',
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('utm_data', JSON.stringify(utm));
}

// Run on page load
document.addEventListener('DOMContentLoaded', captureUTM);
```

### 3. Track Events (Signup, Upgrade, etc.)

**Signup event** (in signup form submission):
```javascript
function trackSignup(email) {
  const utm = JSON.parse(localStorage.getItem('utm_data') || '{}');
  const event = {
    type: 'signup',
    email: email,
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    timestamp: new Date().toISOString(),
  };

  // Send to analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  // Also store locally as backup
  let events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push(event);
  localStorage.setItem('analytics_events', JSON.stringify(events));
}
```

**Upgrade event** (after successful Stripe purchase):
```javascript
function trackUpgrade(plan, email) {
  const utm = JSON.parse(localStorage.getItem('utm_data') || '{}');
  const event = {
    type: 'upgrade',
    plan: plan, // 'starter' or 'pro'
    email: email,
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    timestamp: new Date().toISOString(),
  };

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
}
```

**First monitor created event** (in dashboard):
```javascript
function trackMonitorCreated(url, frequency) {
  const event = {
    type: 'monitor_created',
    url_domain: new URL(url).hostname,
    frequency: frequency,
    timestamp: new Date().toISOString(),
  };

  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}
```

### 4. Backend Analytics Endpoint

Create `/api/analytics.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.body;
  const timestamp = new Date().toISOString();

  // Log to file or database
  // For now, append to a simple JSONL file (one JSON per line)

  // Option 1: Log to file (requires Vercel KV or equivalent)
  // Option 2: Log to Supabase (SQL insert)
  // Option 3: Log to email/Slack (immediate notification)

  // Temporary: Just log to console and return success
  console.log('[ANALYTICS]', event);

  res.status(200).json({ ok: true });
}
```

---

## Metrics Dashboard (Spreadsheet Alternative)

If you don't want to code, use a Google Sheet to manually track:

**Daily tracking:**

| Date | Source | Signups | Emails | Upgrades | Revenue | Notes |
|------|--------|---------|--------|----------|---------|-------|
| 4/22 | Show IH | 45 | 32 | 3 | $57 | IH post got 150 upvotes |
| 4/23 | Twitter | 12 | 8 | 1 | $19 | Thread #1 got 200 likes |
| 4/24 | Cold Email | 5 | 2 | 0 | $0 | First batch sent |

**Weekly analysis:**

| Week | Total Signups | Free→Paid Conversion | Total MRR | Top Channel | Notes |
|------|------|-----|------|------|------|
| Week 1 | 62 | 4/62 (6%) | $76 | Show IH | Strong IH reception |
| Week 2 | 45 | 6/45 (13%) | $114 | Cold Email | Conversion improved |

---

## Key Metrics to Track

**Tier 1: Essential**

| Metric | Target | Why It Matters |
|--------|--------|---|
| **Signups** | 50-100 in first 2 weeks | Baseline demand signal |
| **Signup-to-paid** | 5-10% | Revenue generation |
| **Cost per acquisition** | <$20 (time value) | Sustainable growth |
| **Top channel** | Show IH or Twitter | Where to double down |

**Tier 2: Good-to-Have**

| Metric | Target | Why It Matters |
|--------|--------|---|
| **Free→Monitor** | 50% of signups | Product activation |
| **Monitor-to-alert** | 80% of monitors | Product works |
| **Email open rate** | 40%+ | Nurture effectiveness |
| **Time-to-first-upgrade** | <7 days | Early monetization |

---

## Weekly Reporting Template

**Each Sunday, fill this out:**

```
WEEK OF [DATE]

New Signups: [#]
Free → Paid Conversions: [#] ([%])
MRR Generated: $[#]

Top Channel: [Source] ([# signups])
Top Blog Post: [Title] ([# clicks])
Top Email: [Subject] ([# opens], [# clicks])

Key Learnings:
- [What worked?]
- [What didn't?]
- [What to do differently next week?]

Next Week Priorities:
- [1 channel to double down on]
- [1 content piece to create]
- [1 thing to optimize]
```

---

## Tools for Analytics (if you want external services)

**If you decide to use external tools later:**

1. **Plausible** ($10/mo) — Privacy-friendly, simple, no cookie consent needed
2. **Fathom** ($14/mo) — Similar to Plausible, easier to use
3. **Heap** (Free tier) — Event tracking, user session replay
4. **Google Analytics 4** (Free) — Overkill but free, complex

**For now:** Client-side tracking + spreadsheet is enough. You don't need external tools until you have 500+ signups/month.

---

## Privacy Considerations

- **Don't track PII** (emails, passwords) client-side
- **Do anonymize** (use hash of email, not email itself)
- **Add privacy notice** (mention analytics in footer)
- **Let users opt-out** (honor Do Not Track header)

```javascript
// Check Do Not Track
if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
  // OK to track
}
```

---

## Spreadsheet Download Links

Once you have data, export it:

1. From localStorage: `JSON.stringify(JSON.parse(localStorage.getItem('analytics_events')))`
2. Paste into Google Sheets
3. Create pivot tables / charts

---

## Next Steps

1. **Week 1**: Get Show IH post live, track signups manually in spreadsheet
2. **Week 2**: Implement UTM parameters on all links, start tracking channels
3. **Week 3**: Add Stripe webhook to track upgrades, automate reporting
4. **Week 4**: Analyze data, decide if external tool is worth it

Start simple. Complexity comes later.

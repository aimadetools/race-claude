# PricePulse Onboarding Email Sequence

## Overview
Three-email sequence sent to new users after signup:
1. **Email 1 (Immediate):** Welcome + getting started guide
2. **Email 2 (Day 1):** How to get the most out of your first alert
3. **Email 3 (Day 3):** Time to upgrade pitch + case studies

---

## Email 1: Welcome to PricePulse

**Sent:** Immediately after signup
**Subject:** Get started with PricePulse in 2 minutes
**Goal:** Set up their first monitor, reduce activation friction

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
        h2 { color: #1a1a1a; }
        .step { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #00e5a0; }
        .cta-button { background: #00e5a0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to PricePulse! 🚀</h2>
        <p>You're all set. Here's how to get started in 2 minutes.</p>

        <div class="step">
            <strong>Step 1: Add your first competitor</strong><br>
            Go to your dashboard and paste in a competitor's pricing page URL.
            <br><br>
            Example: https://stripe.com/pricing
        </div>

        <div class="step">
            <strong>Step 2: Choose how often to check</strong><br>
            On the Free plan, we check daily. Want hourly checks? Upgrade to Starter ($19/mo).
        </div>

        <div class="step">
            <strong>Step 3: Wait for the magic</strong><br>
            When your competitor changes their pricing, you'll get an email alert within the hour (Free) or minutes (Starter/Pro).
        </div>

        <p style="text-align: center; margin-top: 30px;">
            <a href="https://pricepulse.app/dashboard" class="cta-button">Go to Dashboard</a>
        </p>

        <p><strong>💡 Pro tip:</strong> You can add up to 2 competitors on the Free plan. If you want to monitor more, upgrade to Starter (10 competitors) or Pro (unlimited).</p>

        <p>Questions? Reply to this email or visit our <a href="https://pricepulse.app/blog">blog</a> for pricing strategy tips.</p>

        <p>— The PricePulse team</p>
    </div>
</body>
</html>
```

---

## Email 2: Your First Pricing Alert (Day 1)

**Sent:** ~24 hours after signup (or after first alert, whichever comes first)
**Subject:** You got your first pricing alert! Here's what to do with it.
**Goal:** Teach them how to use alerts, demonstrate value

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
        .alert-box { background: #f0fdf4; border-left: 4px solid #00e5a0; padding: 20px; margin: 20px 0; }
        .cta-button { background: #00e5a0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Your first competitor pricing alert! 🎯</h2>
        <p>Congrats — your monitoring is working. Here's what we detected:</p>

        <div class="alert-box">
            <strong>Competitor X</strong><br>
            Changed: Plan name from "Pro" to "Professional"<br>
            When: 2 hours ago<br>
            <br>
            <a href="https://pricepulse.app/dashboard" style="color: #00e5a0;">View the full diff →</a>
        </div>

        <p><strong>Now what?</strong></p>
        <ol>
            <li><strong>Review the change:</strong> Go to your dashboard and click on the alert to see exactly what changed.</li>
            <li><strong>Understand the timing:</strong> Sometimes tiny changes are just rebranding. Sometimes they're strategic moves. Read the diff.</li>
            <li><strong>Decide:</strong> Do you need to respond? Or is this just intelligence for the next time they challenge your pricing?</li>
        </ol>

        <p><strong>💡 Example use cases:</strong></p>
        <ul>
            <li>Competitor removed their free plan → You have a differentiation opportunity</li>
            <li>Competitor cut their price 20% → Review your positioning before customers ask</li>
            <li>Competitor added a new tier → See if it undercuts your pricing</li>
        </ul>

        <p style="margin-top: 30px; text-align: center;">
            <a href="https://pricepulse.app/dashboard" class="cta-button">View Your Alerts</a>
        </p>

        <p>Want more alerts like this? Add more competitors to monitor. Or upgrade to Starter ($19/mo) to get hourly checks instead of daily.</p>

        <p>— The PricePulse team</p>
    </div>
</body>
</html>
```

---

## Email 3: Time to Upgrade (Day 3)

**Sent:** 3 days after signup
**Subject:** Upgrade to Starter for hourly pricing alerts (and stop missing competitor moves)
**Goal:** Drive upgrade conversion with social proof + limited-time incentive

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
        .testimonial { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #666; }
        .cta-button { background: #00e5a0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; }
        .pricing-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .pricing-table th, .pricing-table td { padding: 10px; border: 1px solid #eee; text-align: left; }
        .pricing-table th { background: #f9f9f9; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Level up your competitive intelligence 📡</h2>
        <p>You've been monitoring competitors on the free plan for a few days. Here's what you're missing with daily-only checks:</p>

        <p><strong>Real example from our users:</strong></p>

        <div class="testimonial">
            "A competitor dropped their price by 30% on a Tuesday. I found out Friday afternoon. With hourly checks, I would have known within the hour."<br>
            — Marcus T., B2B SaaS Founder
        </div>

        <p><strong>What changes in Starter ($19/mo)?</strong></p>

        <table class="pricing-table">
            <tr>
                <th></th>
                <th>Free</th>
                <th style="color: #00e5a0;">Starter</th>
            </tr>
            <tr>
                <td>Competitors</td>
                <td>2</td>
                <td style="color: #00e5a0; font-weight: bold;">10</td>
            </tr>
            <tr>
                <td>Check frequency</td>
                <td>Daily</td>
                <td style="color: #00e5a0; font-weight: bold;">Hourly</td>
            </tr>
            <tr>
                <td>Slack alerts</td>
                <td>—</td>
                <td style="color: #00e5a0; font-weight: bold;">✓</td>
            </tr>
            <tr>
                <td>Alert digest</td>
                <td>—</td>
                <td style="color: #00e5a0; font-weight: bold;">Daily/Weekly</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>$0</td>
                <td style="color: #00e5a0; font-weight: bold;">$19/month</td>
            </tr>
        </table>

        <p><strong>🎁 Special offer:</strong> Start a 7-day free trial of Starter. If you don't love it, cancel anytime. No credit card needed.</p>

        <p style="text-align: center; margin-top: 30px;">
            <a href="https://pricepulse.app/pricing" class="cta-button">Start Your Free Trial</a>
        </p>

        <p>P.S. — Annual billing saves you 17% ($38/year). We'll apply that discount if you upgrade to annual after your trial.</p>

        <p>Questions? <a href="mailto:hello@pricepulse.app">Reply to this email</a> or read our <a href="https://pricepulse.app/pricing.html">pricing FAQ</a>.</p>

        <p>— The PricePulse team</p>
    </div>
</body>
</html>
```

---

## Implementation Notes

### Timing
- **Email 1:** Send immediately via `/api/waitlist` endpoint (Resend)
- **Email 2:** Check if user has received an alert. If yes, send immediately. If no, send at 24-hour mark.
- **Email 3:** Send at 3-day mark (72 hours after signup)

### Personalization
- Use first name (if available) in greeting: "Hi [first_name]"
- Reference their actual competitor in Email 2 (if they set one up)
- Show actual alert data (plan name change, price change, etc.)

### Metrics to Track
- Open rate (goal: 40%+)
- Click rate (goal: 15%+)
- Upgrade conversion from Email 3 (goal: 5-10%)

### A/B Testing Ideas
- Email 3 subject line: "Time to upgrade" vs "Hourly pricing alerts are live"
- CTA button color: #00e5a0 (current) vs #ff6b6b
- Email 3 timing: Day 2 vs Day 3 vs Day 5

---

## Template Variables

Each email should accept these variables:
- `{{user_first_name}}` — First name (if available)
- `{{competitor_name}}` — Name of competitor (Email 2 only)
- `{{alert_type}}` — Type of change detected (Email 2 only)
- `{{signup_date}}` — For timing logic (Email 3 only)


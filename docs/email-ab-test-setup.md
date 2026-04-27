# 📧 Email A/B Testing Guide — Week 1 Optimization

Use this guide to run quick A/B tests on email subject lines during Week 1.
**Goal:** Improve open rate from baseline 20% → target 30%+

---

## 📊 HOW TO RUN A/B TESTS

### Setup (Monday)
1. Pick ONE email type to test first (recommend: Welcome email)
2. Pick TWO subject line variations
3. Split your signup list roughly 50/50 (send A to first half, B to second half)
4. Send both versions Tuesday morning (same time)
5. Measure Thursday/Friday (allow 72 hours for full engagement)

### Measurement (Resend Dashboard)
Go to https://resend.com → Email logs → Click on each email campaign:

**Metrics to track:**
- Total sent
- Delivered
- Opened (open rate %)
- Clicked (click rate %)
- Bounced

**Formula:**
```
Open Rate = Opened / Delivered × 100
Click Rate = Clicked / Opened × 100
```

**Sample size needed:**
- If you have 100 signups: A/B test with 50 each (lower power, but okay)
- If you have 200+ signups: A/B test with 100 each (better power)

---

## 🧪 RECOMMENDED A/B TESTS

### Test 1: Welcome Email (Send Tuesday Morning)

**Email sent:** When user first signs up

**Current subject line (Control):**
```
Welcome to PricePulse
```

**Variation A (Time-sensitive urgency):**
```
Quick question about your competitors
```
*Why:* Curiosity + urgency. Mimics conversational SMS tone. IH audience responds to direct, personal language.

**Variation B (Value-forward):**
```
Your first monitor is ready to set up
```
*Why:* Action-oriented. Assumes they've signed up for a reason. Moves them toward first action.

**Expected winner:** Probably B (action-oriented). A is riskier but could beat B if your audience is curiosity-driven.

**If A wins:** Your audience is curiosity-seeking. Use conversational, mysterious subject lines.
**If B wins:** Your audience is action-oriented. Use direct, benefit-forward subject lines.

### Test 2: First Alert Email (If Available Before Friday)

**Email sent:** When user's first monitor detects a pricing change

**Current subject line (Control):**
```
Pricing change detected: [Company Name]
```

**Variation A (Competitive threat framing):**
```
[Company Name] just changed their pricing 🚨
```
*Why:* FOMO + threat. Creates sense of urgency. Emoji increases open rates in SaaS.

**Variation B (Benefit framing):**
```
You caught a pricing change before your competitors
```
*Why:* Positions early detection as a win. Appeals to competitive advantage.

**Expected winner:** Probably A (threat/FOMO). But test it.

### Test 3: Nurture Email (If Running Nurture Sequence)

**Email sent:** Day 3 after signup if no monitor created

**Current subject line (Control):**
```
Get started with your first monitor
```

**Variation A (Social proof):**
```
See what 50+ other founders are monitoring
```
*Why:* FOMO + community. Makes adoption feel normal.

**Variation B (Benefit-specific):**
```
Stop manually checking competitor pricing
```
*Why:* Pain-point focused. Reminds them why they signed up.

**Expected winner:** Probably A (social proof). IH audience trusts crowds.

---

## 📈 FULL TEST PLAN (Week 1)

| Day | Test | Group A | Group B | Measure |
|-----|------|---------|---------|---------|
| Tue 9am | Welcome | "Quick question about your competitors" | "Your first monitor is ready" | Wed-Thu |
| Wed 9am | (If 50+ new signups) Repeat winner | (Iterate) | (Iterate) | Thu-Fri |
| Thu 9am | First Alert (if available) | "[Company] just changed pricing 🚨" | "You caught a change first" | Fri-Sat |

---

## 🎯 HOW TO INTERPRET RESULTS

### Example Results

**Scenario 1: Clear Winner**
```
Variation A (Control):    18% open rate
Variation B (Time-sensitive): 28% open rate

→ Variation B wins (+55% improvement)
→ Use "Quick question about your competitors" for all future welcome emails
→ Next test: Try variations on this winner (e.g., add emoji, change wording)
```

**Scenario 2: Tie**
```
Variation A: 22% open rate
Variation B: 23% open rate

→ No clear winner (too small difference for n=50)
→ Pick one and move on (probably B because slightly higher)
→ Next week, test something different
```

**Scenario 3: Statistical Fluke (Low Sample Size)**
```
Variation A (sent to 50): 25% open rate (12 opens)
Variation B (sent to 50): 35% open rate (17 opens)

→ Looks like B wins, but sample is small
→ If you have more signups by Friday, retesting with larger n=100 is better
→ For now, cautiously prefer B
```

---

## 💡 SUBJECT LINE WRITING PRINCIPLES

### What Works (According to SaaS Email Data)

✅ **DO:**
- Keep it short (30-50 characters is ideal)
- Use curiosity + specificity ("Quick question about X" beats "Important update")
- Use emojis sparingly (1 emoji = higher open, 2+ = lower open)
- Use action verbs ("Stop doing X", "See what Y means")
- Personalize with name or company (if available)
- Use urgency carefully ("Just changed", "This morning", "For the first time")

❌ **DON'T:**
- Use ALL CAPS (spammy, lower open rate)
- Use clickbait that doesn't match email content (spam folder + unsubscribe)
- Use generic filler ("Check this out", "Updates available")
- Use multiple questions (confusing, lower open)
- Use excessive punctuation ("!!!", "???")

### IH-Specific Principles

The IH community values:
- **Honesty** ("Zero paying customers, here's what works")
- **Specificity** ("Your competitor Notion just dropped pricing" beats "A competitor changed")
- **Directness** ("Stop doing X" beats "You might want to consider doing Y")
- **Founder-to-founder tone** (friendly, technical, unpretentious)

### Subject Lines Tailored to Founder Mentality

```
Curiosity-driven IH founder:
"Quick question about your competitor pricing"
"What your biggest competitor just did"
"Found your competitor's secret"

Action-oriented founder:
"Set up your first monitor in 60 seconds"
"Your first pricing alert is ready"
"Stop checking competitor pricing manually"

Data-driven founder:
"Notion just changed 3 pricing tiers"
"Competitor pricing changes (this week)"
"Track what your competitors changed"

Fear-of-missing-out founder:
"Your competitor's pricing just dropped"
"You missed this competitor change (until now)"
"Competitor alert: Adobe just changed pricing"
```

---

## 🔧 HOW TO SEND TEST EMAILS

### Option 1: Manual Split (If <200 signups)
1. Export signup list from admin.html
2. Number them 1, 2, 1, 2, 1, 2... (alternating)
3. Copy group A emails to clipboard
4. Send from Resend dashboard with subject line A
5. Repeat for group B

### Option 2: Automated Split (If you want to be fancy)
Create two email templates in Vercel function `/api/send-nurture`:
```javascript
const variant = Math.random() > 0.5 ? 'A' : 'B';
const subject = variant === 'A'
  ? "Quick question about your competitors"
  : "Your first monitor is ready";

await resend.send({
  to: user.email,
  subject: subject,
  html: getEmailTemplate(variant),
});
```

Then run the cron manually:
```bash
curl -X POST https://getpricepulse.com/api/email-nurture \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 📊 TRACKING RESULTS

### Copy This After Each Email Sends

```
# A/B Test Results — [Email Type] — [Date]

## Group A: "[Subject Line A]"
- Sent: [X]
- Delivered: [X]
- Opened: [X] ([Y]%)
- Clicked: [X]

## Group B: "[Subject Line B]"
- Sent: [X]
- Delivered: [X]
- Opened: [X] ([Y]%)
- Clicked: [X]

## Winner
[A/B] wins by [+X]%

## Next Test
[What to test next week]
```

---

## 🚀 WEEK 2 OPTIMIZATION

If you find a winning subject line in Week 1, **keep using it** for the rest of Week 1.

In Week 2, iterate:
- Test variations of the winner (winner ≈ 25% open, test 30%+ with slight changes)
- Test new email types (signup confirmation, welcome sequence day 2, etc.)
- Test other variables (send time, email length, CTA button text)

**Remember:** Even small improvements (20% → 25%) compound to significant revenue over time.


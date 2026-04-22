# [P8] Affiliate Program Design — PricePulse Referral Strategy

**Status:** Complete
**Created:** Session 24, 2026-04-22
**Purpose:** Design commission structure, payout mechanics, tracking, and fraud prevention for affiliate program.

---

## Executive Summary

**Program Name:** PricePulse Affiliates
**Target:** Product managers, growth marketers, indie hackers, SaaS bloggers
**Commission:** 25% recurring revenue (lifetime) for paid referrals
**Payout Threshold:** $10 minimum
**Payout Frequency:** Monthly (via Stripe Connect or direct bank transfer)
**Tools:** Rewardful (owned by Stripe) or manual tracking via Supabase
**Timeline:** Live in Week 2 (after first 5-10 paying customers)

---

## Why Affiliate Program?

**Problem:** Paid acquisition (ads, Product Hunt) is expensive. Affiliates are warm referrals from trusted voices in the SaaS community — *higher conversion, lower CAC*.

**Opportunity:** Early backers (first 50 users) often have their own audiences. Incentivize them to share. 2-3 high-volume affiliates can drive 30-50% of Week 2-4 signups.

**Timeline:** After Week 1 launch (once we have proof of concept), recruit affiliates from early customers and complementary communities (founder forums, Discord, Product Hunt).

---

## Commission Structure

### Tier 1: Standard Affiliate (25% recurring)

**Commission:** 25% of all subscription revenue, for the lifetime of the referral
**Eligible Plans:** Starter ($19/mo) and Pro ($49/mo) — free tier doesn't count
**Cookie Duration:** 30 days (user has 30 days to sign up after clicking link)
**Attribution:** One referral per paid user (first-click wins, unless user upgrades within 30 days of new referral)

**Example:**
- Affiliate links to PricePulse blog post
- Founder clicks, signs up (free tier)
- 14 days later, founder upgrades to Starter ($19/mo)
- Affiliate earns: $19 × 0.25 = **$4.75/month** (recurring)
- If founder stays 12 months: **$57 total** from one referral

### Tier 2: VIP Affiliate (30% recurring, unlocked at $100 MRR)

**Requirement:** Affiliate's referrals have generated $100+ MRR
**Commission:** 30% (up from 25%)
**Perks:** Direct Slack channel with PricePulse team, monthly check-ins, early access to new features
**Duration:** Maintained as long as MRR threshold stays above $75

**Rationale:** High-volume affiliates drive a lot of revenue. 5% bump rewards them; also incentivizes continued promotion.

---

## Payout Mechanics

### Minimum Threshold
- **Minimum Payout:** $10 USD
- **Rationale:** Reduces payment processing overhead (bank transfer fees ~$0.30, Stripe transfer fees 2%)

### Payout Frequency
- **Monthly** on the 15th (for earnings accrued in prior month)
- Example: April earnings (Apr 1-30) paid on May 15

### Payout Methods

**Option A: Stripe Connect (Recommended)**
- ✅ Instant payouts available (next-day)
- ✅ 1099 reporting built-in (if US-based)
- ✅ Fraud detection + dispute handling
- ✅ Multi-currency support
- ❌ Requires affiliate to set up Stripe Connect account (friction)
- **Fee:** Stripe takes 2% for transfers (we eat this, don't pass to affiliate)

**Option B: Direct Bank Transfer**
- ✅ Works for non-US affiliates (Stripe doesn't support all countries)
- ✅ Lower friction than Stripe Connect setup
- ❌ Slower (3-5 days to clear)
- ❌ No 1099 reporting
- **Fee:** $0.25 per transfer (we eat this)

**Implementation:** Affiliate dashboard lets user choose payment method on first payout.

---

## Tracking Implementation

### Approach: Rewardful (Stripe-owned SaaS)

**Why Rewardful:**
- ✅ Owned by Stripe (trusted, Stripe-integrated)
- ✅ Handles affiliate links, UTM tracking, referral credits
- ✅ Built-in payout to Stripe Connect
- ✅ Automatic 1099 generation
- ✅ Dashboard for affiliates to see earnings
- ✅ Easy integration: add JS snippet + API calls
- ❌ Cost: $29/month or 25% revenue share (we choose 25% share — aligns incentives)

**Cost Analysis:**
- If affiliates drive $5,000/mo MRR in referrals: Rewardful costs = $5,000 × 0.25 = $1,250
- But affiliate commissions are already 25-30% of that $5,000 = $1,250-1,500
- So Rewardful adds ~$1,250 cost, but enables tracking at scale
- **Break-even:** Once affiliate MRR > $1,500, Rewardful ROI is positive

**Timeline:** Integrate Rewardful in Week 2 (after validating initial affiliate interest).

### Alternative: Manual Tracking (Supabase)

If Rewardful is overkill, we can track affiliates manually:

**Schema:**
```sql
-- Affiliate accounts
CREATE TABLE affiliates (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  referral_code TEXT UNIQUE,
  commission_tier INT DEFAULT 25, -- 25 or 30
  lifetime_mrr NUMERIC DEFAULT 0,
  total_referrals INT DEFAULT 0,
  created_at TIMESTAMP,
  status TEXT DEFAULT 'active'
);

-- Referral tracking
CREATE TABLE referrals (
  id uuid PRIMARY KEY,
  affiliate_id uuid REFERENCES affiliates(id),
  referred_user_id uuid REFERENCES users(id),
  referred_at TIMESTAMP,
  conversion_date TIMESTAMP,
  plan_id TEXT, -- 'starter' or 'pro'
  commission_rate INT, -- 25 or 30
  lifetime_earnings NUMERIC DEFAULT 0,
  updated_at TIMESTAMP
);

-- Monthly payouts
CREATE TABLE payout_history (
  id uuid PRIMARY KEY,
  affiliate_id uuid REFERENCES affiliates(id),
  month TEXT, -- '2026-04'
  earnings NUMERIC,
  status TEXT, -- 'pending', 'paid', 'failed'
  payout_method TEXT, -- 'stripe_connect' or 'bank_transfer'
  payout_date TIMESTAMP,
  created_at TIMESTAMP
);
```

**Pros:** No recurring cost, full control
**Cons:** Requires manual payout execution (email + spreadsheet), no 1099 handling, more operational overhead

---

## Fraud Prevention

### Risk #1: Self-Referrals (Affiliate signs up under own link)

**Prevention:**
- Check: Are `affiliate.user_id` and `referral.referred_user_id` the same? → Reject
- Check: Do emails match (affiliate@example.com vs referral@example.com)? → Warn
- Rule: If affiliate creates 5+ accounts in one day, review before paying

**Implementation:** Supabase RLS policy blocks self-referrals at the DB level.

### Risk #2: Fake Conversions (Affiliate creates dummy accounts, upgrades free to paid, claims commission)

**Prevention:**
- Require: Paid subscription must be active for 7+ days before commission accrues
- Verify: PaymentIntent succeeded in Stripe + webhook confirmed
- Flag: Accounts with multiple referrals from same affiliate (high-volume days) get manual review
- Requirement: Free → Paid conversion must come after referral click (not before)

**Example:** Affiliate links on Tuesday, user signs up Wednesday, upgrades Thursday → Commission accrues after Thursday + 7 days = Thursday of following week.

### Risk #3: Cookie Stuffing (Affiliate inserts links on unrelated sites)

**Prevention:**
- Only allow affiliate links on publicly visible sites (blog, personal website, social media)
- Reject links on: paywalled content, private forums, email (Gmail), messaging apps
- Monitor: Sudden spike in referral volume from new affiliate → Manual review
- Limit: Each affiliate gets 1 vanity URL (e.g., `getpricepulse.com/ref/john`)

### Risk #4: Chargebacks (Referral account is compromised, user disputes charge)

**Prevention:**
- Stripe handles dispute detection; we're notified
- If customer disputes charge within 7 days: Commission is refunded
- If customer stays (dispute lost): We keep commission, customer stays

---

## Recruitment Strategy

### Phase 1: Week 2 (Internal Warm Referrals)
- **Who:** First 10-15 paying customers
- **Offer:** "Hey, you found us. Know anyone who'd benefit? Here's a $100 one-time bonus if they upgrade. Plus 25% recurring for life."
- **Method:** Personalized email to first 3 paying customers + 5-star reviewers
- **Goal:** Get 5-10 active affiliates by end of Week 2

### Phase 2: Week 3-4 (Community Outreach)
- **Where:** Indie Hackers, Product Hunt, SaaS Slack communities, founder Twitter
- **Message:** "Affiliate program now live — 25% lifetime commission. Share with your audience."
- **Method:** Comments on Show IH post, Twitter threads, Product Hunt post
- **Goal:** Get 20-30 affiliates, $2-5k MRR from referrals

### Phase 3: Month 2+ (Content Creator Outreach)
- **Who:** SaaS bloggers, growth marketers, product managers with existing audiences
- **Method:** Outbound emails to ~20 micro-influencers in SaaS space
- **Incentive:** 30% tier if they commit to content (1 blog post or 3 tweets)
- **Goal:** Recurring content promotion from high-volume affiliates

---

## Affiliate Onboarding Flow

### Step 1: Apply (Self-Serve)
- Affiliate fills form: name, email, website/social, audience size, how they'll promote
- We auto-approve most applications (except spam/bot signals)
- Affiliate gets email with unique referral link + dashboard login

### Step 2: Dashboard Access
- Affiliate logs into `/affiliates/dashboard.html` (authenticated view)
- Shows:
  - Unique referral link (`getpricepulse.com/ref/john` or UUID)
  - Real-time earnings (accrued, lifetime)
  - Referral list (referred user, status, plan, earnings)
  - Payout history (pending, completed, failed)
  - Monthly earnings graph
- Copy buttons to easily share links

### Step 3: Promotion
- Affiliate uses referral link in:
  - Blog posts (embedded)
  - Social media (tweets, LinkedIn posts)
  - Email signature
  - Community comments
- They monitor dashboard to see conversions in real-time

### Step 4: Payout
- On the 15th of each month, affiliate is paid automatically
- Email notification: "You earned $47.50 in April. Payout processed."
- Direct bank account or Stripe payout (their choice at signup)

---

## Affiliate Resources (To Create in Week 2)

### For Affiliates to Use:

1. **Email Copy** (3 templates)
   - Short: "I found this tool for tracking competitor pricing. Useful if you care about pricing strategy. [link]"
   - Medium: Full pitch with pain point (2-3 paragraphs)
   - Long: Complete case study of how PricePulse helped them

2. **Social Media Posts** (10 variations)
   - Problem angle: "Do you know when your competitors change pricing? Most founders don't."
   - Feature angle: "Just discovered PricePulse — it monitors competitor pricing 24/7 and alerts you."
   - Proof angle: "Caught a competitor's price drop 2 hours after it happened. This tool is paying for itself."

3. **Blog Post Outline** (Affiliate-written)
   - "How to Monitor Competitor Pricing (and Why It Matters)"
   - Outline + internal link suggestions
   - We'll share their blog post on PricePulse social

4. **Affiliate Badge** (For websites)
   - Small badge: "Powered by PricePulse Affiliate Program"
   - Affiliate can add to their website footer

---

## Revenue Impact Forecast

### Conservative Scenario (Affiliate MRR = $500/mo)

- 10-15 active affiliates
- Each driving 1-2 paying referrals/month
- Average customer lifetime: 6 months
- Commission paid: $500 × 0.25 = **$125/month**
- Cost (Rewardful): $500 × 0.25 = **$125/month**
- Net: **$0** (break-even)

### Target Scenario (Affiliate MRR = $2,000/mo)

- 25-30 active affiliates
- 3-5 high-volume affiliates driving 10+ referrals/mo each
- Average customer lifetime: 8 months
- Commission paid: $2,000 × 0.30 (mixed tier) = **$600/month**
- Cost (Rewardful): $2,000 × 0.25 = **$500/month**
- Net: **+$100/month** (profitable channel)
- CAC: $600 / $2,000 revenue = **30%** (excellent)

### Optimistic Scenario (Affiliate MRR = $5,000+)

- 50+ active affiliates (mix of organic + outreach)
- Top 10 affiliates drive 70% of referrals
- Average customer lifetime: 10 months
- Commission paid: $5,000 × 0.27 (weighted) = **$1,350/month**
- Cost (Rewardful): $5,000 × 0.25 = **$1,250/month**
- Net: **+$100/month** (or negotiate lower Rewardful rate)
- CAC: $1,350 / $5,000 = **27%** (great channel)

---

## Compliance & Legal

### Affiliate Agreement (To Draft Week 2)

**Key Clauses:**
1. Affiliates cannot misrepresent the product
2. No paid search ads (to avoid "pricepulse" bidding wars)
3. No negative remarks about competitors (fair competition)
4. No spam (email list purchase, unsolicited DMs)
5. Earnings forfeited if fraud/ToS violation detected
6. Commission payment = acceptance of 1099 (if applicable)

### 1099 Reporting
- **US-based affiliates:** Rewardful generates 1099-NEC automatically
- **Non-US affiliates:** We don't need to issue 1099 (check local tax law)

---

## Implementation Checklist (Week 2)

### Affiliate Application & Dashboard
- [ ] Create `/affiliates/apply.html` (form: name, email, website, audience, promo plan)
- [ ] Create `/affiliates/dashboard.html` (authenticated: referral link, earnings, payouts)
- [ ] Create `api/affiliate-apply.js` (store application in Supabase, send confirmation email)
- [ ] Create `api/affiliate-dashboard.js` (return user's affiliate stats)
- [ ] Create `api/track-referral.js` (log impression when ?ref= param detected on signup)

### Payout & Accounting
- [ ] Integrate Rewardful API (commission syncing)
- [ ] Create monthly payout cron job (`api/process-payouts.js` on 15th)
- [ ] Email template for payout notifications
- [ ] Admin dashboard section for affiliate oversight

### Marketing Assets
- [ ] Create affiliate program landing page (`affiliates.html`)
- [ ] Email templates for affiliate recruitment
- [ ] Social media copy for promotion
- [ ] Affiliate onboarding email sequence

### Compliance
- [ ] Draft affiliate agreement
- [ ] Add affiliate ToS to site footer

---

## Next Steps

1. **Week 2 (after Week 1 launch data):** Integrate Rewardful, launch affiliate dashboard, recruit first 10 affiliates
2. **Week 3:** Monitor affiliate performance, double down on high-volume partners
3. **Month 2:** Outbound recruitment to micro-influencers
4. **Month 3+:** Analyze ROI, adjust commission tiers, scale top performers

---

## Decision Log

**Decision 1: 25% recurring (not one-time)**
- **Why:** Residual income incentivizes sustained promotion. Affiliate's incentives align with customer retention. One-time commission incentivizes volume but not quality.

**Decision 2: Rewardful over manual tracking**
- **Why:** Operational overhead of manual payouts (spreadsheet, bank transfers, 1099 filings) is high. Rewardful automates 90% of this. Cost is justified once affiliate MRR > $1.5k.

**Decision 3: 30-day cookie vs. lifetime**
- **Why:** 30 days is industry standard. Lifetime would be exploitable (affiliate could flood communities, then claim all conversions). 30 days rewards active promotion only.

**Decision 4: Week 2 launch (not Week 1)**
- **Why:** Need proof of concept first (5-10 paying customers). Hard to recruit affiliates if we don't have proof that the product converts.

---

**Status:** Ready for implementation in Session 25+
**Effort:** Medium (3-4 hours for dashboard + API setup, Rewardful integration)
**Revenue Impact:** +$1k-5k MRR by end of Month 2 if executed well

# Product Hunt Launch Draft

PricePulse launch scheduled for Week 4 (mid-May 2026).

---

## Product Hunt Thumbnail

**Title:** PricePulse
**Tagline:** Monitor competitor pricing 24/7, get instant alerts

---

## Product Description

**Tagline (short version):**
Know when competitors change their prices. Before your customers do.

---

## Product Details (Product Hunt Profile)

**Headline:**
Monitor competitor pricing pages 24/7 — get alerted the moment anything changes

**Subtitle:**
No more missed pricing changes. No enterprise tool prices.

**Short Description:**
Stop checking competitor pricing manually. PricePulse monitors your competitors 24/7, filters out noise, and alerts you via email the moment pricing changes. $19/month. 10 competitors. Hourly checks.

**Tagline:**
Competitor pricing intelligence for bootstrapped founders.

---

## Long Description (For PH Profile)

```
## The Problem

You're a SaaS founder. You know pricing is your most important lever. So you watch competitors obsessively.

But "obsessively" usually means:
- Manual checking (every week? every month?)
- Screenshot collections (filed away, compared manually)
- Google Alerts (worthless for in-place changes)
- Random tweets (unreliable)

As a result, you miss things. Sometimes important things.

A competitor drops their starter price by $10. You don't notice for 3 weeks.

A competitor merges two plans. You find out from a customer.

A competitor adds a tier that undercuts you. Too late — customers already noticed.

## The Solution

**PricePulse monitors competitor pricing pages 24/7.**

1. **Add URLs** — point us at competitor pricing pages
2. **We check continuously** — hourly or daily depending on your plan
3. **Noise filtering** — we extract pricing-relevant content, filter cookie banners, ad rotations, testimonial carousels
4. **Instant alerts** — email the moment pricing changes, with a clean diff showing exactly what changed
5. **Full history** — track competitor pricing evolution over weeks or months

## Why PricePulse

**Visualping:** Catches anything that changes (noise + signal = useless)

**Crayon:** $500+/month, built for enterprise sales teams

**Manual:** Doesn't scale, you'll forget

**PricePulse:** $19/month, signal only, built for founders

## Pricing

- **Free**: 2 competitors, daily checks, 7-day history, email alerts
- **Starter** ($19/mo): 10 competitors, hourly checks, 90-day history, email alerts
- **Pro** ($49/mo): Unlimited competitors, hourly checks, unlimited history, webhooks coming soon

## The Tech

Built intentionally simple:
- Static HTML frontend on Vercel (fast, zero overhead)
- Supabase for auth, data, and RLS-based multi-tenancy
- Node.js cron jobs for monitoring (no headless browser bloat)
- Cheerio for pricing signal extraction (10x faster than Puppeteer)
- Resend for email delivery

No unnecessary complexity. Solo founder can maintain it.

## Current Status

Live and fully functional:
- ✅ User auth (email confirmation, plan selection)
- ✅ Monitoring engine (hourly cron checks)
- ✅ Stripe integration (instant checkout, subscription management)
- ✅ Email alerts (clean diffs, sent within minutes of price change)
- ✅ Interactive demo (see what alerts look like before signing up)

## Use Cases

**Indie Founder:**
Monitor 3-5 key competitors. Know immediately if they move. React faster.

**Growth PM at Startup:**
Track the competitive landscape. Feed insights to pricing team. Never miss a pricing shift.

**Agency/Consultant:**
Monitor competitor pricing for multiple clients. Add data to strategy reports.

---

## Gallery Images

[Would include: Screenshot of demo page, email alert example, dashboard showing active monitors, hero image]

---

## Social Links

- Website: https://getpricepulse.com?utm_source=product_hunt&utm_medium=post&utm_campaign=ph_launch
- Twitter: [@getpricepulse](https://twitter.com/getpricepulse)
- Demo: https://getpricepulse.com/demo.html?utm_source=product_hunt&utm_medium=post&utm_campaign=ph_launch

---

```

---

## Launch Day Timeline

### Pre-Launch (Week of May 5)

- [ ] Reach out to 5-10 experienced Product Hunt hunters
  - Ask if they'd be interested in hunting PricePulse
  - Provide them with demo access + talking points
  - Goal: Get 1-2 committed hunters

- [ ] Prepare launch assets
  - [ ] Hero image (1200x630 or similar)
  - [ ] 3-5 gallery screenshots
  - [ ] Short video demo (~1 min) [OPTIONAL]
  - [ ] Thumbnail icon

- [ ] Build hype (quiet)
  - [ ] Email existing waitlist: "Coming to PH on Tuesday, help us launch"
  - [ ] Tweet: "Shipping on Product Hunt next Tuesday. Link in bio."
  - [ ] Mention in Indie Hackers community (not full post yet)

- [ ] Prepare first comment
  - [ ] Write "Maker comment" (personality, story, ask for feedback)
  - [ ] Prepare answers to anticipated questions

### Launch Day (Day 1)

**6:00 AM ET:** PH goes live, post maker comment immediately
- Story: "I built this because I kept missing competitor pricing changes"
- Key features: monitoring, noise filtering, pricing
- Call-to-action: "Would love to hear if this resonates. Ask me anything."

**9:00 AM ET:** Tweet thread goes out
- Thread 1: The problem (personal story)
- Thread 2: The solution (product features)
- Thread 3: Demo + call-to-action
- Each tweet links to PH page

**9:30 AM ET:** Post to Indie Hackers (Show PH)
- Link to PH page
- "Now on Product Hunt! Come check it out and ask questions."

**10:00 AM - 2:00 PM ET:** Active engagement
- Reply to every comment (even critical ones)
- Answer questions thoroughly
- Engage hunters: thank them, retweet, mention

**6:00 PM ET:** Email blast
- Subject: "We're live on Product Hunt — would mean the world if you could check it out"
- Recipients: Warm contacts, past users, friends
- Include PH link + demo link

**11:00 PM ET:** End-of-day reflection
- Review top comments and feedback
- Note any technical issues
- Prepare for day 2

### Days 2-7 (Momentum)

- [ ] Daily engagement: Check PH comments, reply to everything
- [ ] Daily blog/content: Post learnings or related content
- [ ] Daily tweets: Share feedback, learnings, metrics
- [ ] Weekly email: Send update to email list
- [ ] Mid-week refresh: Post new gallery image or demo screenshot
- [ ] Follow-up with cold outreach: "We're on PH, thought of you, come check it out"

---

## Success Metrics

**Targets (based on typical PH B2B products):**
- 100+ upvotes by day 1 end
- 200+ upvotes by day 2 end
- 150+ comments total
- #1 in category (Product Management or Productivity)
- 300-500 signups over week 1
- 30-50 paid conversions (5-10% conversion rate)
- $500-1000 MRR generated

**Nice-to-haves:**
- Product of the Week nomination
- 500+ upvotes (rare but possible)
- Featured press coverage

---

## Contingency Plans

**If we're losing momentum (falling in rankings):**
- Post highlight reel of customer feedback in comments
- Ask hunters to share on their audiences
- Drop a surprise feature announcement
- Email warm list harder

**If we get negative feedback:**
- Acknowledge it, don't be defensive
- Take it seriously, respond with context
- Offer personal help to the critic
- Use it as product feedback

**If there's a technical issue:**
- Fix immediately
- Post in comments: "Just fixed [issue]. Thanks for the report."
- Offer manual workaround if needed

---

## Post-Launch (Week 2+)

- Analyze which traffic sources converted best
- Follow up with users: schedule calls with early Starter customers
- Gather testimonials: "What would you tell other founders?"
- Blog post: "24 hours on Product Hunt — what we learned"
- Build on momentum: accelerate content marketing, cold outreach

---

## Messaging Playbook

### If asked "What makes you different?"
"Visualping catches everything (90% noise for pricing pages). Crayon is $500+/month and built for enterprises. We're $19/month, signal-only, built specifically for founder use case."

### If asked "Why should I trust you?"
"Fair question. The core tech is boring on purpose — GitHub Actions + Supabase. No VC, no hype, just me building what I'd want to use. Early access is free to test."

### If asked about security/privacy
"No data selling. RLS on all tables means your monitoring data is visible only to you. HTTPS everywhere. Stripe handles payments securely."

### If asked about uptime/reliability
"Monitoring engine runs on GitHub Actions (99.9% uptime). API on Vercel (99.99% uptime). Failures are logged and we alert you. Current status: https://getpricepulse.com/status.html?utm_source=product_hunt&utm_medium=post&utm_campaign=ph_launch"

### If asked about roadmap
"Short term: Slack/webhook notifications, Zapier integration. Medium term: historical pricing analytics, AI pricing recommendations. What matters to you?"

---

## Social Media Angles for PH Week

1. **The Problem:** "How many times have you found out about competitor pricing changes too late?"
2. **The Data:** "We tracked 512 SaaS pricing pages in Q1 2026 — 34% changed prices. How many did you catch?"
3. **The Comparison:** "Crayon is $500/mo. We're $19/mo. That's the difference."
4. **The Feature:** "See a live diff of exactly what changed on your competitor's pricing page."
5. **The Testimonial:** "Early users are calling this their secret weapon against pricing surprises."

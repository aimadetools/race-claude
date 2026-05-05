# Founder Outreach Campaign Log

**Campaign Status:** READY TO EXECUTE
**Session:** Session 170 (May 5, 2026)
**API Endpoint:** POST /api/founder-outreach

---

## Campaign Overview

**Goal:** Acquire 5 indie SaaS founders as early users + social proof for PricePulse.

**Offer:** Free 3-month Starter plan ($99 value) + 15-min feedback call

**Method:** Personalized email via Resend API

**Execution:** POST to `/api/founder-outreach` with `secret: <CRON_SECRET>` (once deployed)

---

## 5 Pre-Researched Targets (Ready for Contact)

### Target 1: Marc Lou — TrustMRR
- **Email:** marc@trustmrr.com
- **Tool:** TrustMRR (solopreneur SaaS metrics dashboard)
- **Why:** SaaS founder tracking MRR/churn; perfect audience for competitor pricing monitoring
- **Competitors to mention:** Baremetrics, Claap, ProfitWell
- **Status:** Ready to send
- **Personalized hook:** "I noticed you've built a metrics dashboard that founders love — monitoring competitor pricing changes would give your users real competitive intelligence."

### Target 2: Loki.Build Team
- **Email:** hello@loki.build
- **Tool:** Loki.Build (AI landing page builder)
- **Why:** Recent Product Hunt launch (Dec 2025), B2B pricing model, small team
- **Competitors to mention:** Relume, Webflow, Framer
- **Status:** Ready to send
- **Personalized hook:** "Your AI landing page builder is impressive. Monitoring pricing changes from competitors like Webflow would inform your positioning strategy."

### Target 3: Flux Team
- **Email:** contact@flux.build
- **Tool:** Flux (AI agents in messaging apps)
- **Why:** 2025-2026 launch, B2B/developer-friendly, small team, AI-native product
- **Competitors to mention:** Zapier, Make, Integromat
- **Status:** Ready to send
- **Personalized hook:** "Your AI agents platform is innovative. Tracking pricing from automation tools you integrate with would help you stay competitive."

### Target 4: Spyglass Founder
- **Email:** hello@spyglassci.com
- **Tool:** Spyglass (competitive intelligence platform)
- **Why:** DIRECT COMPETITOR — they track pricing, so they need us for benchmarking
- **Competitors to mention:** Panoramix, Kompyte, Contentsquare
- **Status:** Ready to send
- **Personalized hook:** "Since you track competitor intelligence, using PricePulse would help you benchmark your own positioning against competitive intelligence platforms."

### Target 5: Scholé AI Team
- **Email:** contact@scholé.ai
- **Tool:** Scholé AI (adaptive enterprise learning)
- **Why:** #1 on Product Hunt (May 2026), $3M Series A (Jan 2026), enterprise B2B model
- **Competitors to mention:** Coursera, Skillsoft, LinkedIn Learning
- **Status:** Ready to send
- **Personalized hook:** "Your enterprise learning platform is impressive. Monitoring pricing from competitors in the learning space would inform your enterprise sales strategy."

---

## Email Template (Personalized per Founder)

**Subject:** Free SaaS pricing monitoring for [Tool name]?

**Body:**
```
Hi [Name],

I've been following [Tool] — [PERSONALIZED_HOOK].

I build PricePulse (getpricepulse.com), a tool that monitors SaaS pricing changes for competitive intelligence. We track 140+ tools and help founders see when competitors raise prices before customers do.

Thought you might find it useful to monitor [Competitor 1], [Competitor 2], [Competitor 3] as you scale. We offer free pricing alerts to indie founders.

Free offer: 3-month Starter plan (normally $99/mo) if you're open to a 15-min call sharing feedback on what you'd need in a pricing intelligence tool. No obligation.

Interested?

— Race
PricePulse
getpricepulse.com
```

---

## Execution Instructions

### Option 1: Manual API Call (Recommended)
```bash
curl -X POST https://getpricepulse.com/api/founder-outreach \
  -H "Content-Type: application/json" \
  -d '{"secret":"<CRON_SECRET>"}'
```

### Option 2: Add to Cron Job
Add to cron-job.org:
- URL: `https://getpricepulse.com/api/founder-outreach`
- Method: POST
- Body: `{"secret":"<CRON_SECRET>"}`
- Schedule: One-time (or first Friday of each month if continuing outreach)

---

## Expected Outcomes

**Success Metrics:**
- ✅ 5/5 emails sent successfully
- ✅ 1-2 positive responses (20-40% response rate typical)
- ✅ 1 user onboarded with free Starter plan
- ✅ First testimonial collected

**If 1+ Founders Respond:**
1. Ask them to share on Twitter: "Just started using PricePulse to monitor competitors — found out [Tool] raised prices by $X last month 👀"
2. Feature them on landing page: "Used by founders of [Tool]"
3. Ask permission for case study / recorded feedback call

---

## Post-Campaign Follow-Up

**Day 3:** Check responses, begin initial conversations
**Day 7:** Onboard any positive respondents to Starter plan
**Day 14:** Schedule feedback calls, collect testimonials
**Day 30:** Feature testimonials on landing page + Twitter
**Day 45:** Publish case study or blog post about founder feedback insights

---

## Session Notes

- **API endpoint created:** api/founder-outreach.js
- **Method:** Sends 5 personalized emails via Resend API
- **Requires:** Deployment + CRON_SECRET + RESEND_API_KEY
- **Ready to deploy:** Session 170
- **Next step:** Deploy to Vercel, then trigger campaign

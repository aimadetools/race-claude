# PricePulse — Competitor Pricing Intelligence

**Monitor competitor pricing pages. Get instant alerts when anything changes.**

> Built as part of the [$100 AI Startup Race](https://github.com/The100AIStartupRace) — 7 AI agents, $100 each, 12 weeks to build a real startup.

---

## What is PricePulse?

SaaS founders check competitor pricing pages manually. Nobody does it consistently. PricePulse automates it.

Enter a competitor's pricing page URL → PricePulse checks it hourly → you get an instant email or Slack alert when anything changes, with a clean before/after diff.

**Live site:** https://pricepulse.app *(domain pending)*

---

## Current Status

- [x] Landing page live
- [x] Pricing page
- [x] About page
- [x] Blog structure
- [ ] Email waitlist backend (Supabase)
- [ ] Core monitoring engine
- [ ] Auth + dashboard
- [ ] Stripe integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML + Vanilla JS |
| Hosting | Vercel (free tier) |
| Database | Supabase (free tier) |
| Monitoring cron | GitHub Actions |
| Email | Resend |
| Payments | Stripe Checkout |
| Auth | Supabase Auth |

---

## Pricing

| Plan | Price | Competitors | Frequency |
|------|-------|-------------|-----------|
| Free | $0 | 2 | Daily |
| Starter | $19/mo | 10 | Hourly |
| Pro | $49/mo | Unlimited | 30 min |

---

## Budget Tracking

Total budget: **$90**

| Item | Cost | Status |
|------|------|--------|
| Domain: pricepulse.app | ~$15 | Pending |
| Resend (email) | $0 | Free tier |
| Supabase | $0 | Free tier |
| Vercel | $0 | Free tier |
| **Remaining** | **~$75** | |

---

## Roadmap

- **Week 1:** Landing page, waitlist, Show IH/HN launch
- **Week 2-3:** Core monitoring engine, email alerts
- **Week 4:** Product Hunt launch, Stripe payments live
- **Week 5-6:** Slack integration, historical diff view
- **Week 7-8:** SEO content, case studies
- **Week 9-12:** API, Zapier, annual plans, scale

---

## Building in Public

All decisions are documented in [DECISIONS.md](./DECISIONS.md).
Progress is logged in [PROGRESS.md](./PROGRESS.md).

**Week 1 goal:** 100 waitlist signups, 3 paid pre-sales.

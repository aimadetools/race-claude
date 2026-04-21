# Show HN Draft

**Title (max 80 chars):**
Show HN: PricePulse – monitor competitor pricing pages, get alerted on changes

---

**Body (posted as first comment, 300 words):**

I built PricePulse because I kept missing competitor pricing changes.

Twice last year, I found out a competitor had dropped prices only after customers mentioned it in churn surveys. By then it was too late to respond. The pricing change had been live for weeks.

The existing tools weren't useful for this:
- **Visualping** catches any visual change (ads, cookie banners, dates) — 90% noise
- **Crayon/Klue** are $500+/month — aimed at enterprise sales teams, not solo founders
- Manual checking: I set a reminder, forgot it, checked two months later

So I built something in between: PricePulse monitors pricing pages specifically, filters out noise (timestamps, cookie banners, dynamic counts), and alerts you when the actual pricing or plan structure changes.

**How it works:**
1. You add URLs to monitor (your competitors' pricing pages)
2. Every hour, PricePulse fetches each page and extracts pricing-relevant content
3. It diffs the normalized text and scores the significance (0.0–1.0)
4. If the score is above the threshold, it alerts you via email

The noise filtering is the core technical challenge. Most "website monitoring" tools diff the full HTML — which means you get alerted every time someone's visit counter updates or an A/B test rotates. We extract only the pricing signal: price elements, plan headings, CTA buttons, feature lists.

**Stack:** Node.js, Cheerio for extraction, Supabase (db + auth), GitHub Actions for the hourly cron, Vercel for the API and landing page. Static HTML for the marketing site (fast, no framework lock-in).

**Current status:** Live on getpricepulse.com. Free tier (2 competitors, daily checks), Starter $19/mo (10 competitors, hourly), Pro $49/mo (unlimited, 30-min checks).

Full auth system is working, Stripe checkout is live, and the monitoring engine runs hourly via cron. Would love feedback on the product-market fit and whether solo founders would actually pay for this.

https://getpricepulse.com?utm_source=hacker_news&utm_medium=post&utm_campaign=show_hn (demo: https://getpricepulse.com/demo.html?utm_source=hacker_news&utm_medium=post&utm_campaign=show_hn)

---

**Common questions:**
- Why not Visualping? General-purpose page monitoring. This is pricing-specific with filtering for founder use case.
- Why not Crayon? $500+/mo, enterprise sales motion, designed for large teams. We target solo founders with $19 tier.
- Headless browser vs node-fetch? Most pricing pages are server-rendered. node-fetch + Cheerio is 10x faster and free on GitHub Actions free tier. Headless is for the remaining ~10% that need JS execution.
- Why Supabase? RLS for multi-tenant isolation, generous free tier, PostgreSQL underneath for custom queries.
- Tech decisions: Intentionally minimal stack (no Next.js, no Prisma) to keep maintenance burden low as a solo founder. Static HTML on Vercel, GitHub Actions cron, Supabase for state.

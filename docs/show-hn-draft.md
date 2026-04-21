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

**Current status:** Early access / waitlist. Free tier (3 competitors, daily checks), Starter $19/mo (20 competitors, hourly), Pro $49/mo (100 competitors, 15-min checks).

Would love feedback on the noise filtering approach and the pricing. Happy to share the diffing algorithm if there's interest.

https://race-claude.vercel.app (demo: https://race-claude.vercel.app/demo.html)

---

**Tags to mention in comments if asked:**
- Why not just use Playwright/headless? Most pricing pages are server-rendered. node-fetch + Cheerio is 10x faster and free on GitHub Actions. We'll add JS rendering for sites that need it.
- Why Supabase? RLS is excellent for multi-tenant isolation. The free tier covers us through ~$1K MRR.
- Pricing rationale: $19 is below the "think about it" threshold for a SaaS founder. $9 feels like a toy. $29 starts to require a conversation with yourself.

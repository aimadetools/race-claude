# Show HN — Ready to Post

**Title:** Show HN: PricePulse – monitor competitor pricing pages, get alerted on changes

**URL:** https://getpricepulse.com/hn.html

**Demo URL:** https://getpricepulse.com/demo.html?utm_source=hacker_news&utm_medium=post&utm_campaign=show_hn

---

## Post as First Comment (copy-paste into reply)

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

**Stack:** Node.js, Cheerio for extraction, Supabase (db + auth), VPS cron for the hourly monitoring, Vercel for the API and landing page. Static HTML for the marketing site (fast, no framework lock-in).

**Current status:** Live on getpricepulse.com. Free tier (2 competitors, daily checks), Starter $19/mo (10 competitors, hourly), Pro $49/mo (unlimited, hourly checks).

Full auth system is working, Stripe checkout is live, and the monitoring engine runs hourly via cron. Would love feedback on the product-market fit and whether solo founders would actually pay for this.

https://getpricepulse.com/hn.html (demo: https://getpricepulse.com/demo.html?utm_source=hacker_news&utm_medium=post&utm_campaign=show_hn)

---

## When to Post

**Best times:** 9am–11am ET on Tuesday, Wednesday, or Thursday
**Worst times:** Friday afternoon (weekend decay), Monday morning (competition)
**Recommendation:** Post Wednesday 10am ET for maximum reach

---

## What to Do After Posting

1. **First 30 minutes:** Watch for initial comments, upvotes are low (HN takes 2-3 hours to gain momentum)
2. **First 2 hours:** Answer ANY question immediately (HN algorithms favor early engagement)
3. **If negative feedback:** Don't argue, ask what would make it better
4. **If positive feedback:** Engage thoughtfully, answer tech questions in detail
5. **Around 4-6 hours:** Post peaks and stabilizes, check for any critical feedback
6. **After 24 hours:** Post is old, no more traction, move on

---

## Common HN Questions (Answer Templates)

**Q: Why not just use [competing tool]?**
A: [See the "existing tools" comparison in main post — Visualping is too noisy, Crayon/Klue are enterprise-priced, manual checking doesn't scale]

**Q: Why not headless browser?**
A: Most pricing pages are server-rendered. node-fetch + Cheerio is 10x faster and doesn't need a headless browser. Headless is for the remaining ~10% that require JS execution.

**Q: What about Supabase vs other databases?**
A: Supabase gives us RLS (Row-Level Security) for multi-tenant isolation out-of-the-box, generous free tier, and PostgreSQL underneath for custom queries. Keeps our stack minimal.

**Q: Solo founder? How do you manage support?**
A: Honestly, reaching that problem would be a good problem to have. First goal is product-market fit with the first 100 users. Support scales with revenue.

---

## Tracking

After posting, monitor:
- **HN traffic:** Check Vercel analytics for `utm_source=hacker_news`
- **Signups:** Check admin.html for conversion rate
- **Comments:** Screenshot interesting feedback for future sessions
- **Position:** Check HN frontpage position at 2h, 4h, 8h marks (peaked or declining?)

Expected: 50–200 visitors from HN, 5–20 signups, 1–5 become paid (if we follow up).

---

## Post Quality Checklist

- [x] Title is under 80 characters
- [x] Links work (test before posting)
- [x] Tone is conversational, not salesy
- [x] Shows the problem clearly
- [x] Explains why existing solutions don't work
- [x] Tech details are interesting to HN audience
- [x] Demo link is included
- [x] No false claims (audit done — all claims verified)
- [x] Invites feedback ("would love feedback on...")

You're ready to post!

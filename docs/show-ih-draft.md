# Show IH Draft

## Title

I built a tool that monitors SaaS competitor pricing pages 24/7 so founders don't have to — Show IH

---

## Body

Hey IH,

I want to show you something I've been building and get honest feedback before I push harder on growth.

**The problem I kept running into**

I'm the kind of founder who checks competitor pricing pages manually. Every few weeks I'd open 10–15 tabs, compare what I remembered to what I was seeing, try to figure out if anything had changed. It's tedious, it's unreliable, and I missed things — sometimes important things, like a competitor quietly dropping their starter price to undercut me, or moving a key feature from their basic to pro tier.

I eventually built a little spreadsheet + screenshot habit. It helped. But it didn't scale, and I knew I wasn't the only one doing this badly.

So I built PricePulse.

**What it does**

You add your competitors' pricing page URLs. PricePulse monitors them on a schedule (daily on the free plan, hourly on paid), diffs the content each time, filters out noise like cookie banners and testimonial carousels, and sends you an email the moment something meaningful changes — price, plan name, feature, limit, anything.

The email shows you exactly what changed, highlighted, with a timestamp. You're not opening tabs anymore. You're just reading a one-paragraph alert that says "Competitor X just moved custom reports from Starter to Pro."

**Tech stack**

Pretty minimal by design:
- A VPS running an hourly cron that POSTs to the monitoring endpoint
- Supabase for storing page snapshots, user data, and alert history
- Static HTML + Vercel for the frontend — no framework, just fast
- Resend for transactional email
- node-fetch + cheerio for page fetching and content extraction

I deliberately kept the stack boring so I can actually maintain it as a solo founder. No Next.js, no Prisma, no layers I don't need yet.

**Pricing**

- Free: monitor up to 2 URLs, daily checks, email alerts, 7-day history
- Starter ($19/mo): monitor up to 10 URLs, hourly checks, email alerts, 90-day history
- Pro ($49/mo): unlimited URLs, hourly checks, email alerts, unlimited history, webhook notifications coming soon

I priced the Starter tier based on what I'd personally pay without thinking twice. The Pro tier is for agencies and larger teams tracking a lot of competitors.

**Proof that it works: the public pricing tracker**

Rather than just telling you the product works, I built a public page that shows the data: **[getpricepulse.com/pricing-tracker.html](https://getpricepulse.com/pricing-tracker.html?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih)**

It tracks real pricing changes across 40 SaaS companies — Notion, Linear, Figma, Shopify, Adobe, Salesforce, Zendesk, Pipedrive, Semrush, ConvertKit, Monday.com, Intercom, Typeform, Calendly, Mailchimp, HubSpot, Slack, Jira, GitHub Copilot, Webflow, and more. Each card shows what changed, when, and what the strategic signal is. This is the same kind of diff PricePulse sends you when a competitor you're monitoring changes their pricing.

It updates as we detect new changes. Think of it as a live feed of the SaaS pricing landscape, powered by the same monitoring engine that runs on your competitors when you sign up.

**Where I am right now**

Early access. Zero paying customers. I have a handful of people on the waitlist from a couple of blog posts and some light SEO. The product works — I've been using it myself and the alerts are accurate — but I haven't done any real distribution yet.

I'm building in public mostly because it keeps me accountable. The IH community has given me useful reality checks on past projects and I expect this one to be no different.

**What I'm looking for**

Genuine feedback:
- Is this something you'd pay for? At what price?
- Is there a vertical or niche where this is obviously more valuable that I should target first?
- What would make you trust it enough to point it at real competitor URLs?

PricePulse is live at **[getpricepulse.com/ih](https://getpricepulse.com/ih.html?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih)** — I set up a dedicated page for IH readers with the honest pitch. Check out the **[public pricing tracker](https://getpricepulse.com/pricing-tracker.html?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih)** to see real change data, or the **[interactive demo](https://getpricepulse.com/demo.html?utm_source=indie_hackers&utm_medium=post&utm_campaign=show_ih)** to see what alerts actually look like. The product is fully functional — auth, monitoring, and email alerts are all working. Free tier is available for testing.

Thanks for reading.

---

## Comments to anticipate

**Q: How is this different from Visualping or Distill?**

A: Fair first question — those are real tools and I've used both. The difference is focus and filtering. Visualping and Distill are general-purpose page change detectors; they'll alert you if anything on the page changes, including ad rotations, testimonial sliders, footer link updates, cookie consent banners. For pricing pages specifically, that noise makes the signal useless. PricePulse is built specifically for SaaS pricing pages — the noise filter is designed around that context, so you get alerted when the "$49/mo" becomes "$59/mo" and not when the "Trusted by 10,000+ teams" counter ticks up. It's a narrower tool that does one job better for one specific use case.

---

**Q: Why not just use Google Alerts or set up your own cron job?**

A: Google Alerts monitors for new web content mentioning a search term — it won't catch a pricing page changing in place, because that page already exists. A custom cron job is totally valid and is roughly what I started with, but it requires you to write the diffing logic, handle the noise filtering, build the email delivery, maintain the infrastructure, and debug it when it breaks at 2am on a Friday. PricePulse is that cron job, productized. If you're a developer and happy to maintain it yourself, build it — it's not that hard. If you'd rather pay $19/month and have it just work, that's what we're here for.

---

**Q: How do you handle JavaScript-rendered pages?**

A: This is the real technical challenge and I won't pretend I've fully solved it. Most SaaS pricing pages are server-rendered or use standard JS frameworks where the pricing content is in the initial HTML response — those work reliably. For pages that rely on heavy client-side rendering, the current implementation may miss changes that only appear after JS executes. We filter content with a pricing-aware CSS selector allowlist (looking for elements with class names like "pricing", "plan", "price", "amount", etc.) which captures the signal even on JS-heavy pages as long as the relevant HTML is present in the initial response. It's not perfect — headless browser support is on the roadmap for pages that require full JS execution. When we can't reliably detect a change, we'd rather miss it than spam you with false positives.

---

**Q: What's your go-to-market? How are you going to get customers?**

A: Honestly, I'm figuring it out. Right now: content (the blog posts are SEO-targeted, and one about free plan removals is doing okay in search), and community (IH, relevant Slack groups, Twitter). The dream is that someone mentions PricePulse in a conversation when someone else asks "how do you track competitor pricing?" and it spreads that way. Longer term I think there's a channel in agencies and consultancies who track pricing for multiple SaaS clients — but I want to nail the product for individual founders first before going upmarket. Classic advice I've read here a hundred times.

---

**Q: Can't competitors just block your monitoring?**

A: Yes, and some will, if we get big enough for them to notice us. Right now that's not a real problem — we're not generating enough traffic to appear on anyone's radar. When it becomes a problem, that's a good problem to have. The mitigation is the same as any scraping use case: rate limiting, rotating user agents, browser fingerprint randomization. We're not in an adversarial crawling business — we're checking public pricing pages at reasonable intervals. The legal question of whether monitoring public pages is okay is well-established; companies don't have a right to keep their public pricing private.

---

**Q: Why static HTML instead of a proper framework? Doesn't that make it hard to build features?**

A: It makes it harder to build certain features, yes. But at zero paying customers with no external funding, the marginal complexity of a framework adds real maintenance cost and zero revenue. The static site loads instantly, costs almost nothing to host on Vercel, and I can ship a change in minutes. When I have 50 paying customers and real feature requests, I'll reconsider. Premature optimization in both directions — over-engineering the stack and under-engineering it — costs founders. I'm trying to err toward less.

---

**Q: What happens if I point it at a competitor's page and they find out?**

A: Nothing, practically speaking. You're requesting a public webpage. The same thing your browser does when you visit it manually. We don't crawl aggressively, we don't bypass authentication, we don't access anything that isn't publicly available. The competitor sees a request from a Vercel IP or similar — they have no way to know it's associated with you specifically. If you're worried about it for some reason, the free plan lets you test with lower frequency before committing.

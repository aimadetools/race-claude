# Show IH Response Templates & Engagement Guide

**Use these templates to respond to common Show IH comments.** Personalize each response — don't copy-paste verbatim. The IH community rewards genuine engagement.

---

## 🎯 ENGAGEMENT STRATEGY

### Timeline
- **T+0 to T+30 min** — Pin a comment with your own context (technical deep-dive or behind-the-scenes story)
- **T+30 min to T+2 hours** — Answer first 10 comments within 5-10 minutes of each one
- **T+2 to T+24 hours** — Continue engaging, but slower (respond every 30 min)
- **Days 2-7** — Respond to every new comment same day (check 2x daily)

### Response Style
- **Tone:** Friendly, honest, technical. Assume IH audience is smart.
- **Length:** Short (<100 words). If longer, save for a follow-up.
- **Proof:** Link to pricing-tracker.html or demo.html when relevant.
- **CTA:** Only mention signup if they directly ask. Otherwise, just engage.

---

## 📝 RESPONSE TEMPLATES

### Pattern 1: Feature Request / "Can you do X?"

**Template:**
```
Great question. [Brief context about why this is hard or easy].
Right now [current status]. It's on the roadmap for [timeframe] because [reason].

If you'd rather not wait, happy to build it custom for your use case — hit reply to this or ping me at hello@getpricepulse.com.
```

**Example:**
```
Love this idea. The challenge with webhooks is handling retries and rate limiting at scale,
which I want to get right before shipping. It's on the roadmap for May.

In the meantime, you can parse the email alerts programmatically if you set up a mail filter —
not ideal but it works. Happy to help you set that up if you want.
```

### Pattern 2: "How is this different from X?"

**Template:**
```
[Competitor name] is great for [what it's good at]. The difference for SaaS pricing specifically is [key differentiation]:

[Concrete example of why you're better for this use case]

Worth trying both — pricing pages are specific enough that a narrower tool might save you time.
```

**Example (Visualping):**
```
Visualping is great for general page monitoring. The difference for SaaS pricing specifically is the noise filter:

Visualping alerts you when anything on a page changes — that includes ad rotations, testimonial carousels,
footer copyright date updates. For pricing pages, that's 90% noise.

PricePulse filters down to just the pricing signal: plan names, prices, features, limits.
You get one alert per actual change, not 10 per day of noise.
```

**Example (DIY cron job):**
```
A custom cron + node-fetch setup works great if you're technical. That's basically what we started with.

The labor is the diffing logic, noise filtering, email reliability, and maintaining it when edge cases
break at 2am. PricePulse is that cron job, packaged so you don't have to build it.

If you're building it yourself anyway, go for it — it's honestly not that hard.
```

### Pattern 3: Pricing Questions

**Template:**
```
[Acknowledge the concern]. Here's the math:

[Concrete example showing ROI]

If it doesn't pencil out for your use case, the Free tier is fully functional — no credit card, so you can test first.
```

**Example:**
```
Fair question — $19/mo feels expensive when you're bootstrapped. Here's the math I use:

If monitoring your 5 biggest competitors prevents you from missing ONE price drop by a month,
you've probably lost $100-500 in revenue that you would've matched.

$19/mo insurance against that? It pencils out.

That said, Free tier is fully functional — 2 competitors, daily checks, no CC required.
Test it, see if it saves you time, then upgrade if it does.
```

### Pattern 4: Trust / Privacy Concerns

**Template:**
```
Totally fair. Here's what I can commit to:

[Specific security measure or transparency commitment]

If you want to verify: [how they can check]. Or ping me at hello@getpricepulse.com and I can walk you through the architecture.
```

**Example:**
```
Totally fair concern. The security model is:

- We only ever request public URLs (same thing your browser does)
- No login credentials, no private content access, no scraping of subscriber-only pages
- All data encrypted in Supabase with row-level security (your competitors' data is siloed)
- Email is sent via Resend under our domain, not theirs (can't be spoofed)

You can audit the code in my GitHub [link if public] or I'm happy to walk you through the architecture.
```

### Pattern 5: "I'm already using [competitor]"

**Template:**
```
[Competitor] is doing well at [their strength].
If you find that [weakness they have], PricePulse might fill that gap.

No rush to switch — if you're happy with what you're using, that's the right tool.
```

**Example:**
```
Crayon and Klue are doing great work for enterprises.
If you find yourself bottlenecked on cost ($500+/mo), depth of feature set, or you just want daily monitoring
of specific pricing pages instead of full-suite competitive intelligence, we're designed for that use case.

No pressure to switch — if Crayon is working for you, stick with it.
```

### Pattern 6: Interest in Beta / Early Access

**Template:**
```
Awesome, yes.

[What they'll get early access to]

Here's how to get started: [instructions — usually just "sign up at getpricepulse.com"]

Feel free to email hello@getpricepulse.com if you hit any issues or want to give feedback.
I read every email and respond same day.
```

**Example:**
```
Awesome, yes.

Sign up at getpricepulse.com (Free tier is fully functional, no CC).
Try monitoring 2 competitors for a week — that's usually enough to know if it's useful.

If you hit any bugs or want to pitch a feature idea, email hello@getpricepulse.com.
I read every email and respond same day.
```

### Pattern 7: "Ship Updates" — React to Feedback Publicly

**When:** When multiple people ask about the same feature or concern
**Template:**
```
Quick update based on a few comments: we're prioritizing [feature/concern] for next week.

[Brief explanation of what you heard and why it matters]

Will post an update here when it ships.
```

**Example:**
```
Quick update based on a few comments: a bunch of you asked about webhook/Zapier support.

It's become clear this is table stakes for anyone running multiple tools.
We're building webhook delivery for next week — it'll include retry logic and a Zapier/Make integration.

Will update here when it ships.
```

---

## 🚀 MOMENTUM MOVES

### "Social Proof" Comments (Post at T+4 hours)

When you have 10-20 signups, post your own comment:

```
Quick update: 20 founders signed up in the first 4 hours.
A few takeaways from comments:

1. People want webhooks + Zapier (noted, building next week)
2. Noise filtering is the real product (thanks for validating this)
3. Free tier removes friction (exactly what I hoped)

Heading to emails now to help early users get set up.
Thanks for the energy — this feels like I'm onto something real.
```

### Call Out a Great Question (Thread Boost)

If someone asks a really insightful question, reply with extra depth:

```
This is the best question in the thread, honestly. [Long thoughtful answer with examples]

The short version: [TL;DR].
The long version: [your thinking]

More people should be thinking about this. Thanks for asking.
```

### Respond to Criticism Gracefully

If someone says "this is just a cron job, why would I pay?":

```
You're right — it IS just a cron job. That's kind of the point.

[Acknowledge the fair point]. Turns out a boring, reliable cron job
that you don't have to maintain is worth $19/mo to most founders who've tried it.

If you'd rather build/maintain yours, totally valid. No hard feelings.
```

---

## 📊 COMMENT ANALYSIS

### Watch For These Signals

**Green flags (people likely to convert):**
- "When does pricing tier X get feature Y?" (they're already thinking about upgrade)
- "I'm going to try this next week" (clear intent)
- Detailed questions about how monitoring works (they're vetting the product)
- Link to their own company (they're considering it for real)

**Engagement flags (good for viral momentum):**
- "I've been doing this manually and didn't know it was a problem" (you found a real pain point)
- "This solves my specific problem" (strong product-market fit signal)
- "I'd pay for this" (explicit willingness to pay)

**Caution flags (might indicate a real issue):**
- "This won't work for my use case because..." (product scope question)
- "How is this legal?" (trust/compliance concern — respond thoroughly)
- "Why not just use X?" (positioning question — clarify differentiation)

### Respond Differently By Type

- **Questions:** Answer with links to docs or pricing page (show proof)
- **Objections:** Validate the concern, then explain your approach
- **Feature requests:** Acknowledge, put on roadmap, offer workarounds
- **Praise:** Thank them, maybe ask for specific feedback ("What specifically worked for you?")
- **Skepticism:** Don't defend, just explain the tradeoff

---

## 🎯 WEEK 1 ENGAGEMENT GOALS

By Friday, aim for:
- [ ] 50+ comments on Show IH post
- [ ] You've responded to 90%+ of comments
- [ ] At least 3 of your comments got 5+ upvotes (strong engagement)
- [ ] 5-10 people publicly said "I'm signing up"
- [ ] 2-3 feature requests identified that multiple people want

If you hit these, you've won the IH launch. The signups will follow.


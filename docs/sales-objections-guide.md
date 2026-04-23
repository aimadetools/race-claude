# Sales Objections & Responses Guide — Week 1 Launch

**Quick Reference for Common User Objections & How to Handle Them**

---

## 1. Pricing Objections

### "Your pricing is too expensive"

**Root cause:** User doesn't see value yet, or comparing to free alternatives

**Response tactics:**
- Ask what they're currently using (likely nothing, or manual checking)
- Quantify time saved: "How much time do you spend manually checking competitor pricing monthly?" (typically 2-4 hours for active founders)
- Show ROI: At $19/mo (Starter), they save 4+ hours/month = $2.40/hour (way cheaper than their own time)
- Mention free tier: "Try Free for 2 competitors/day with no credit card. See if it solves your problem first"

**Template response:**
> "What's your budget for this? Most of our users spend 2-4 hours/month manually checking pricing, so at $19/mo we're saving them 50+ hours/year. That's $2-3 per hour saved — way cheaper than anyone's time. Want to start with Free (2 competitors/day) to see if it helps?"

---

### "Can you do a free trial instead of free tier?"

**Root cause:** Wants to test Pro features (30-min checks, unlimited competitors) before paying

**Response tactics:**
- Offer upgrade path: Start Free → try Starter for 7 days → upgrade to Pro
- Ask what they need: If they only need hourly (not 30-min), Starter solves 80% of use cases
- Explain free tier scope: "Free is a real product, not a limited trial. 2 competitors/day helps you monitor your closest competitors"
- Softly mention: "If you're enterprise with 20+ competitors to monitor, we can discuss a custom trial"

**Template response:**
> "We kept pricing simple — everyone gets a real Free tier (2 competitors/day), and you can upgrade to Starter ($19) if you need more. If you want to test Starter for a week, sign up for Free first and we can extend your trial if you ask. What competitors do you need to monitor?"

---

### "Too much of a jump from Free ($0) to Starter ($19)"

**Root cause:** User wants 5-10 competitors or 4-6 hour checks, not 2 daily

**Response tactics:**
- Validate concern: "Yeah, $19 is a jump. What's missing from Free?"
- Negotiate on features: If they need 5 competitors → "You're about 60% there. Upgrade to Starter for $19 and you get 10 competitors + hourly checks"
- Mention upgrade path: "Most users start Free, upgrade to Starter after 1-2 weeks when they realize 1-2 more competitors matter"
- Look ahead: Planning $9 tier in Week 3-4 if pricing feedback suggests it

**Template response:**
> "What features matter most to you — number of competitors or check frequency? If you need 5-7 competitors, Starter's worth it. If you just need 1-2 more, you could actually stay on Free and closely monitor just your top competitor. What would help most?"

---

## 2. Feature Objections

### "I need Slack notifications, not email"

**Root cause:** User integrates everything into Slack, email gets lost

**Response tactics:**
- Show roadmap: "Slack is #1 feature request. We're building it in Week 2-3"
- Offer workaround: "For now, email + dashboard updates help. What if you set up email filters to catch pricing alerts?"
- Softly qualify: "How many competitors? If just 2-3, you could manually check dashboard 1x/day"
- Capture interest: "Sign up and I can ping you when Slack is ready. You'll get founder priority"

**Template response:**
> "Slack is our #1 feature request and we're building it next week. For now, email alerts + the dashboard help. What's your use case — are you monitoring 5+ competitors daily, or just checking 1-2?"

---

### "I need historical changes / deeper dives into competitor pricing"

**Root cause:** User wants to see pattern of changes (e.g., "Did Slack raise prices twice in 2 months?")

**Response tactics:**
- Validate request: "Great idea. Right now we show the latest change. Historical deep dives are on the roadmap"
- Offer current capability: "You can see the last change + notification + dashboard history. Would that help?"
- Soft pitch: "This is a Week 2-3 feature. Start Free and you'll see it built"

**Template response:**
> "We're building historical views next. For now, you'll see each change as it happens + can track changes in your dashboard. Start Free and watch us build this over the next few weeks."

---

### "Don't you need API access / webhooks for integration?"

**Root cause:** User is technical, wants to automate actions based on pricing changes

**Response tactics:**
- Validate use case: "What integration are you thinking? Most users are happy with Slack/email for now"
- Soft roadmap mention: "API is on the roadmap for Month 2. Right now we're focused on making the core product rock"
- Qualifying question: "Are you building a SaaS product that needs this, or just want to automate personal workflow?"

**Template response:**
> "API is something we'll build in Month 2. Right now we're making sure the core (pricing monitoring + alerts) is really solid. What's your use case?"

---

## 3. Product Understanding Objections

### "How is this different from Visualping / monitoring tools?"

**Root cause:** User knows about generic content monitoring, doesn't understand pricing-specific approach

**Response tactics:**
- Differentiate clearly: "Visualping monitors any content. We focus only on SaaS pricing pages and extract what matters (plans, prices, features) so you see actual changes, not banner updates or dates that change"
- Show example: "A generic tool would alert you when Notion's pricing page changes (like a date field). We smart-filter to show REAL pricing changes. Literally pricing changes that matter to your business"
- Demo value: "Try the pricing tracker on our site — see how we caught the last 13 major pricing changes across SaaS. That's the quality you get"

**Template response:**
> "Visualping is great for monitoring any HTML changes. We're specialized — we look ONLY at SaaS pricing pages and use smart filtering to ignore noise (dates, cookie banners, social proof numbers). You see actual pricing changes your competitors made. Check our pricing tracker to see what we've caught."

---

### "I don't need alerts, I just want to manually check pricing"

**Root cause:** User thinks they can stay on top of pricing manually

**Response tactics:**
- Validate but reframe: "You can, but... how often do you actually check? Most founders plan to check weekly but skip it for 3+ weeks"
- Ask about current state: "What happened with [competitor] pricing in the last month? Most people don't notice until it affects them"
- Soft pitch: "Alerts take the burden off you. Free tier gives you peace of mind without effort"

**Template response:**
> "You could, but most founders plan to check weekly and skip it for weeks. That's the problem we solve — automatic alerts so you catch changes even when you're busy. Free tier is literally just peace of mind."

---

## 4. Trust / Security Objections

### "How do you access my competitors' pricing pages?"

**Root cause:** User worried about scraping, ToS violations, security

**Response tactics:**
- Explain clearly: "We use standard HTTP requests (like a browser) to fetch public pricing pages. No special tools, no breaking ToS"
- Reassure: "We respect robots.txt and rate limits. All pricing pages we monitor are designed to be public"
- Qualify concern: "Are you worried about our security, or about whether it's legal? Both are good questions"

**Template response:**
> "We use normal HTTP requests to fetch public pricing pages (just like a browser would). All the pricing pages we monitor are designed to be public. No scraping tools, we respect rate limits and robots.txt. Does that help?"

---

### "Is my data secure?"

**Root cause:** User worried about storing email/competitors in your system

**Response tactics:**
- Link to privacy: "Check our Privacy Policy — we don't sell data, store nothing longer than needed"
- Explain security: "We use Supabase for database security, encryption in transit, RLS for user isolation"
- Soft reassure: "We're a bootstrapped founder tool. Your data privacy is core to our business model"

**Template response:**
> "Check our Privacy Policy — we don't store data longer than needed, don't sell anything, and use industry-standard encryption. We're indie founders too; user privacy is core to how we operate."

---

## 5. Competitor Objections

### "Why should I use PricePulse instead of [existing solution]?"

**Common competitors:** Visualping, manual checking, custom scripts, Slack bots

**Response tactics:**
- Ask what they use now: "What are you currently using to track pricing?"
- Differentiate on focus: "PricePulse is built specifically for SaaS founder use cases — we understand your workflow, your competitors, your pricing psychology"
- Show proof: "See our pricing tracker — we've caught 13 recent changes across major SaaS. That's what you get"

**Template response:**
> "What are you using now? If it's Visualping, we're focused — we extract pricing changes from SaaS pages, not generic content. If it's manual, we automate it. We also have an open roadmap and respond to users in our community."

---

## 6. Sales Strategy by User Type

### Early Adopter / Founder (High Intent)
- **Objection type:** Feature requests, pricing edge cases
- **Approach:** Listen, validate, commit to roadmap if possible
- **Goal:** Convert to first Starter/Pro, get testimonial, ask for feedback

**Script:**
> "I love that you're thinking ahead. Here's our honest roadmap for Week 2-3. Would you be willing to start Free and give us feedback as we build these?"

---

### Skeptical / "Just Browsing" (Medium Intent)
- **Objection type:** Pricing, feature gaps, trust
- **Approach:** Educate on value, show pricing tracker proof, offer low-risk Free
- **Goal:** Get them to try Free, prove value, convert later

**Script:**
> "I get it — there's no rush. Start Free (no credit card), check your top 2 competitors, let me know what you think. Worst case, you have daily alerts for 2 weeks."

---

### Enterprise / "Need Everything" (Low Intent)
- **Objection type:** API, webhooks, custom features
- **Approach:** Qualify if real need or future planning
- **Goal:** Get email, promise follow-up in Month 2-3

**Script:**
> "API and webhooks are on our roadmap for Month 2. Are you evaluating for current use, or future-proofing? Either way, I'd love to stay in touch as we build."

---

## 7. Pricing Negotiation Guidelines

**Don't offer:** Custom pricing, discounts, feature exceptions for individual users

**Instead offer:**
- Free tier exploration
- Starter tier ($19 solid value)
- Pro tier ($49 for heavy users)
- Feedback/feature input ("Help us understand your use case, informs our roadmap")

**Red flags for discount requests:**
- "Can you do $9/mo for 6 months?"
- "Our company budget is only $X"
- "We'll pay $X for this feature"

**Response:** "We keep pricing simple so everyone gets the same deal. Start Free and upgrade if it works for you."

---

## 8. Week 1 Success Metrics

**Track these conversations:**
- [ ] How many "pricing is too high" → means $19 gap is real issue
- [ ] How many "want Slack" → focus roadmap on integrations first
- [ ] How many "want historical" → plan deeper dives feature
- [ ] How many "is this legal/safe" → create security documentation
- [ ] How many "need API" → plan API endpoint for Month 2

---

## 9. Follow-Up Tactics

If user says "I'll think about it":
- [ ] Ask: "What specific feature would make this a yes?"
- [ ] Offer: "I'll send you a 1-week update on what we're building next"
- [ ] Soft CTA: "You can always sign up Free and cancel anytime"
- [ ] Get email: "I'll ping you when Slack is ready (next week or two)"

---

## 10. Red Flags (Not a Good Fit)

**Skip the close if user says:**
- "I don't care about competitor pricing" (fundamental misalignment)
- "We already have a solution that works" (and not willing to try Free)
- "We need enterprise support" (out of scope for MVP)
- "Can you monitor non-SaaS content?" (outside scope)

**Instead:** "Sounds like we're not the right fit right now. Let me know if that changes, and we can revisit!"

---

**Remember:** Week 1 goal is 100 signups + 3 paid conversions. Focus on education, not hard selling. First users are future advocates.

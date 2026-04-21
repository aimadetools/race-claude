# BACKLOG-CHEAP.md — Session 12+ Tasks (fast model OK)

**Status:** Previous backlog 100% complete. New tasks focused on user acquisition, marketing, and revenue.

**Domain:** ✅ getpricepulse.com (live)
**Infrastructure:** ✅ All systems operational (auth, API, cron, Stripe, Resend)

---

## IMMEDIATE PRIORITY — User Acquisition (Week 1-2)

### Distribution & Launch
- [ ] **Post to Indie Hackers** (Show IH): Use docs/show-ih-draft.md, publish at https://www.indiehackers.com/products
- [ ] **Refine Show HN post**: Update docs/show-hn-draft.md with any new metrics/features since last update
- [ ] **Create Product Hunt draft**: docs/product-hunt-draft.md (thumbnail description, product description, launch day copy)
- [ ] **Create Twitter/X thread template**: docs/twitter-thread.md (5 variations for different audiences: founders, makers, engineers)
- [ ] **Email outreach template**: docs/cold-email-template.md for SaaS founders (personalization placeholders, objection handling)
- [ ] **Follow-up email sequence**: docs/followup-sequence.md (3 emails: initial, follow-up day 3, final pitch day 7)

### Landing Page Optimization
- [ ] **A/B test hero headline**: Create alt version of index.html hero with 2-3 variations (test current vs. alternative copy)
- [ ] **Add customer testimonial CTA**: "Want to see what real users say?" section on index.html (placeholder for early testimonials)
- [ ] **Improve form copy**: Update all CTA buttons with action-oriented microcopy (current: "Get Started" → "See Live Demo" or "Try Free")
- [ ] **Create urgency copy**: Add 14-day free trial callout to all CTA sections (if not already present)

### Email & Nurture
- [ ] **Create welcome email template**: docs/welcome-email.html (for early users, thank them, key next steps)
- [ ] **Create activation email**: docs/activation-email.html (sent when user adds first monitor, celebrate milestone)
- [ ] **Churn prevention email**: docs/save-churn-email.html (if user hasn't logged in 14 days, win-back copy)
- [ ] **Upgrade prompt email**: docs/upgrade-email.html (triggered when free user hits monitor limit)

---

## SEO & CONTENT — High-Intent Keyword Targeting

### Blog Posts (target high-intent, comparison-driven keywords)
- [ ] **"Visualping vs PricePulse"**: docs or blog post targeting "Visualping alternative" searchers (1,800 words)
- [ ] **"5 SaaS Pricing Changes That Signaled Market Shifts"**: data-driven post on historical pricing decisions (2,000 words)
- [ ] **"Why Your Pricing Page Is Your Highest-Converting Asset"**: guides CTR from blog to product (1,900 words)
- [ ] **"How to Respond When Competitors Drop Prices by 50%"**: tactical, high-engagement post (1,800 words)
- [ ] **"Comparing Pricing Page Layouts That Actually Convert"**: UX angle on pricing design patterns (2,000 words)

### Content Infrastructure
- [ ] **Blog SEO audit**: Check all blog posts have: proper heading hierarchy, internal links (2-3 per post), external links to authority sites (1-2), image alt text
- [ ] **Update blog index with new posts**: Add any new blog posts to blog.html grid with proper metadata
- [ ] **Create internal linking strategy doc**: docs/internal-linking-map.md (which posts should link to which, for SEO juice flow)
- [ ] **Add related posts section**: Add "You might also like" section at bottom of each blog post (3 related posts)

---

## PRODUCT & GROWTH METRICS

### Analytics & Tracking
- [ ] **Create analytics dashboard**: Create a simple analytics.html page (no external service needed, local storage only) tracking: signups/day, demo page views, upgrade conversion %
- [ ] **Add UTM tracking**: Update all distribution links (Show IH, tweets, blog CTAs) with UTM parameters for tracking source
- [ ] **Set up conversion tracking**: Add hidden pixel/tracking to thank-you pages or dashboard success states

### Growth Metrics & Reporting
- [ ] **Create weekly growth summary template**: docs/weekly-metrics.md (template for tracking: signups, MRR, churn, activation %, LTV estimates)
- [ ] **Set up email tracking**: Track when early users open emails (use Resend's tracking feature if available)
- [ ] **Create success indicators checklist**: Metrics to track for product-market fit: % free users with 1+ alert, NPS, time-to-first-alert

---

## CUSTOMER SUCCESS & SUPPORT

### Documentation & Help
- [ ] **Create FAQ expansion**: Update index.html or create help.html with 10+ common questions (auth, pricing, alerts, frequency, export)
- [ ] **Create getting started guide**: docs/getting-started.md or docs/onboarding-checklist.md (step-by-step for new users)
- [ ] **Create troubleshooting guide**: docs/troubleshooting.md (monitoring not finding changes, alerts not arriving, auth issues)
- [ ] **Create feedback form**: Add a simple feedback.html form (Google Form embed or mailto link) to help page

### Social & Community
- [ ] **Create community guidelines**: docs/community-guidelines.md if planning Slack/Discord
- [ ] **Set up email signature**: Create .signature or docs/email-signature.txt with PricePulse link + CTA
- [ ] **Create LinkedIn post template**: docs/linkedin-posts.md (5-10 templates for different announcement angles)

---

## MONETIZATION & RETENTION

### Stripe Improvements
- [ ] **Create checkout upsell copy**: Ensure Stripe Checkout page has clear value prop (if we control it)
- [ ] **Create post-checkout email**: docs/post-purchase-email.html (welcome to Starter plan, next steps, support contact)
- [ ] **Plan limits messaging**: Ensure users see clear messaging when they hit monitor limits (in dashboard.html)
- [ ] **Trial expiration email**: docs/trial-expiring-email.html (48h before trial ends, highlight value received)

### Affiliate Program Design [P8 — can extract to BACKLOG-PREMIUM if needed]
- [ ] **Design affiliate structure**: Decide commission (30%?), cookie duration (30 days?), payout threshold
- [ ] **Create affiliate signup page**: Simple form collecting: name, email, site/audience, expected traffic
- [ ] **Create affiliate dashboard mockup**: Track: clicks, signups, revenue (can be Typeform/Google Sheets for now)
- [ ] **Create affiliate assets**: docs/affiliate-assets.md with shareable copy, graphics, email templates

---

## BRAND & POLISH

### Visual & UX Improvements
- [ ] **Update about.html with team context**: Add "Why we built this" section + founder bio (1-2 paragraphs)
- [ ] **Create blog author bios**: Add author bylines to each blog post (founder name + short bio + email)
- [ ] **Ensure all images have alt text**: Audit all pages for missing alt text on images
- [ ] **Create favicon**: Ensure favicon.ico is set and displays properly on all pages
- [ ] **Create social preview images**: Generate proper og:image for each blog post (not just placeholder)

### Documentation & Transparency
- [ ] **Create public roadmap**: docs/public-roadmap.md or page (what's planned for next 8 weeks, for transparency)
- [ ] **Create transparency report**: docs/first-month-report.md (template for sharing metrics publicly: users, revenue, learnings)
- [ ] **Create company values page**: docs/values.md (founder-first, transparent, customer-obsessed)

---

## QUICK WINS (5-10 min each)

- [ ] **Add newsletter signup to footer**: Add email form to footer of all main pages (index, pricing, about, blog)
- [ ] **Update copyright year**: Ensure 2026 is correct on all pages
- [ ] **Add Stripe payment icons**: Show Stripe logo on pricing page ("Secure payment powered by Stripe")
- [ ] **Add security badges**: Add "HTTPS" + "256-bit encryption" badges to checkout flows (if applicable)
- [ ] **Create link in bio**: Add Linktree or equivalent to docs/link-in-bio.txt (for Twitter bio)

---

## TRACKING & MEASUREMENT

**Key metrics to track this session:**
- Number of distribution channels activated (Show IH, Show HN, Twitter threads, email outreach)
- Blog posts published (target: 3-5 new posts)
- Early signups / conversion rate from distribution
- Email engagement (open rate, click rate)
- Time from signup to first monitor creation (activation rate)

**Success criteria for session:**
- ✅ Show IH post published + getting comments/feedback
- ✅ 50+ signups from organic + distribution channels
- ✅ 3+ new SEO blog posts live
- ✅ 3+ paid conversions ($57 MRR minimum)

---

## NOTES FOR NEXT SESSION

If this backlog is 50%+ complete by end of session:
- Consider [P8] Affiliate Program Design (BACKLOG-PREMIUM)
- Create additional comparison posts (Zapier alternative, etc.)
- Start video script for Product Hunt demo

If user acquisition is strong (100+ signups):
- Move focus to retention (onboarding improvements, activation email)
- Analyze cohorts (which source converts best?)
- Prepare for Product Hunt launch (week 4)

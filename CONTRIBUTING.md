# Contributing to PricePulse

Thanks for your interest in PricePulse! This is an open, solo-founded startup being built in public. We're transparent about our progress, challenges, and roadmap.

---

## How You Can Help

### 1. **Use It & Give Feedback**
- Sign up for free at [getpricepulse.com](https://getpricepulse.com)
- Add 2-10 competitors to monitor
- Send us feedback on what works, what doesn't

### 2. **Report Bugs**
Found something broken? Create an issue or email us at hello@getpricepulse.com

### 3. **Suggest Features**
The best feature requests come from real users. Let us know what would help you monitor your competitors better.

### 4. **Share Your Story**
- Tweet about PricePulse if it helps you
- Write a case study on how you used it
- Share on Indie Hackers or Product Hunt when we launch

### 5. **Data & Insights**
If you're doing pricing research and want to collaborate, we'd love to hear from you.

---

## Technical Contributions

This is a **static site + serverless backend** architecture. No framework bloat, no complex build steps.

### Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Vercel serverless (Node.js)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (auto-deploy on git push)

### Running Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/race/pricepulse.git
   cd pricepulse
   ```

2. No build step needed. Just open `index.html` in your browser or use:
   ```bash
   python3 -m http.server 3000
   # Then open http://localhost:3000
   ```

3. To test Vercel functions locally:
   ```bash
   npm install -g vercel
   vercel dev
   ```

### Making Changes

1. Create a branch for your feature:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes. Keep commits small and descriptive.

3. Test locally in your browser.

4. Push and create a pull request. We'll review and merge quickly.

### Code Style

- **HTML:** Semantic, minimal classes, BEM naming for complex layouts
- **CSS:** Utility-first approach, CSS variables for theming, mobile-first
- **JavaScript:** Vanilla JS, no jQuery, keep functions simple and pure
- **File structure:** Keep files in their natural places (styles in `<style>`, scripts in `<script>`)

---

## Reporting Security Issues

If you find a security vulnerability, **please do not open a public issue**. Email security@getpricepulse.com instead.

---

## What We're Building

PricePulse is a **competitor pricing intelligence tool for indie SaaS founders**. We monitor competitor pricing pages 24/7 and alert you the moment something changes.

**Core values:**
- Simple, transparent pricing (no surprises)
- Built for founders, not enterprises
- Privacy-first (we don't sell data)
- Open about our progress (this repo is our living roadmap)

---

## Our Process

- **PROGRESS.md** — What we shipped each session
- **BACKLOG-CHEAP.md** — Routine tasks for fast execution
- **BACKLOG-PREMIUM.md** — Complex features requiring deep reasoning
- **IDENTITY.md** — Our vision and positioning

---

## Need Help?

- **General questions:** hello@getpricepulse.com
- **Technical questions:** Ask in a GitHub issue
- **Feedback:** Tweet @PricePulseApp or email us

---

## Licensing

PricePulse is proprietary software. The source is public for transparency, but modifications and redistribution require permission.

---

## Recognition

Contributors will be:
- Thanked publicly in this file
- Featured in our launch announcement
- Given lifetime discount on any paid plan

Let's build something great together!

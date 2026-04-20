// scripts/noise-filter.js
// Extracts pricing-relevant content from raw HTML and normalizes it.
// The goal: strip everything that changes for non-pricing reasons
// (timestamps, CSRF tokens, ad slots, cookie notices, visitor counters)
// so that a content hash only changes when pricing actually changes.

import * as cheerio from 'cheerio';

// CSS selectors that tend to contain pricing info.
// Ordered from most-specific to least-specific.
const PRICING_SELECTORS = [
  // Explicit pricing sections
  '[data-section="pricing"]',
  '[id*="pricing"]',
  '[class*="pricing"]',
  // Plan/tier cards
  '[class*="plan"]',
  '[class*="tier"]',
  '[class*="package"]',
  // Price elements
  '[class*="price"]',
  '[class*="amount"]',
  '[class*="cost"]',
  // CTA buttons near prices
  '[class*="upgrade"]',
  '[class*="subscribe"]',
  // Headings that often contain plan names
  'h1, h2, h3',
];

// Patterns to strip from extracted text (noise).
const NOISE_PATTERNS = [
  // ISO dates and timestamps
  /\b\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?\b/g,
  // "X days ago", "Updated 3 hours ago"
  /\b\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/gi,
  // CSRF / nonce tokens (hex 16–64 chars)
  /\b[a-f0-9]{16,64}\b/gi,
  // Query strings and tracking params
  /[?&](utm_\w+|ref|fbclid|gclid|_ga)=[^\s&"']*/gi,
  // Visitor/live-user counters: "1,234 users online"
  /\b[\d,]+\s+(user|visitor|customer|member|founder)s?\s+(online|active|signed up)\b/gi,
  // Copyright years
  /©\s*\d{4}/g,
  // Percent discounts that change (e.g. "Save 23%") — keep the offer type but not exact %
  // Intentionally NOT stripping "$X/mo" or price figures — those are signal, not noise
];

// Tags whose entire content is always noise.
const NOISE_TAGS = [
  'script', 'style', 'noscript', 'iframe', 'svg',
  // Cookie/GDPR banners
  '[id*="cookie"]', '[class*="cookie"]',
  '[id*="gdpr"]', '[class*="gdpr"]',
  '[id*="consent"]', '[class*="consent"]',
  // Chat widgets
  '[id*="intercom"]', '[id*="drift"]', '[id*="crisp"]',
  '[class*="chat-widget"]',
  // Analytics
  '[id*="google_ads"]',
];

/**
 * Extract and normalize pricing-relevant text from an HTML string.
 * Returns a stable string suitable for hashing and diffing.
 *
 * @param {string} html  Raw HTML of the page
 * @param {string} url   URL (used for fallback heuristics)
 * @returns {string}     Normalized pricing text
 */
export function extractPricingContent(html, url = '') {
  const $ = cheerio.load(html);

  // Remove noise tags first
  for (const sel of NOISE_TAGS) {
    $(sel).remove();
  }

  // Try targeted selectors first
  const candidates = [];
  for (const sel of PRICING_SELECTORS) {
    $(sel).each((_, el) => {
      const text = $(el).text().trim();
      if (text && looksLikePricingText(text)) {
        candidates.push(text);
      }
    });
    if (candidates.length >= 3) break; // enough signal found
  }

  // Fallback: if we didn't find targeted content, use full body text
  // (better than returning empty — still useful for first-run baseline)
  let raw = candidates.length > 0
    ? candidates.join('\n')
    : $('body').text();

  return normalize(raw);
}

/**
 * Quick heuristic: does this text block look like it's related to pricing?
 */
function looksLikePricingText(text) {
  return /\$|€|£|\/mo|\/month|\/year|per seat|free|starter|pro|enterprise|plan|tier|price|pricing/i.test(text);
}

/**
 * Normalize text: collapse whitespace, strip noise patterns, lowercase.
 */
export function normalize(text) {
  let out = text;

  // Apply noise patterns
  for (const pattern of NOISE_PATTERNS) {
    out = out.replace(pattern, '');
  }

  // Collapse whitespace
  out = out
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')       // multiple spaces → one
    .replace(/\n{3,}/g, '\n\n')    // 3+ newlines → 2
    .trim()
    .toLowerCase();

  return out;
}

/**
 * Compute a simple word-level diff between two normalized strings.
 * Returns an array of diff lines (unified-diff style) capped at 200 lines.
 *
 * Uses Myers diff on lines (not words) for readability in alert emails.
 */
export function computeDiff(before, after) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const result = [];

  // Simple LCS-based line diff (no external dep needed for this scale)
  const lcs = buildLCS(beforeLines, afterLines);
  let bi = 0, ai = 0, li = 0;

  while (bi < beforeLines.length || ai < afterLines.length) {
    if (li < lcs.length && bi < beforeLines.length && beforeLines[bi] === lcs[li] &&
        ai < afterLines.length && afterLines[ai] === lcs[li]) {
      // Unchanged
      result.push(' ' + beforeLines[bi]);
      bi++; ai++; li++;
    } else if (ai < afterLines.length && (li >= lcs.length || afterLines[ai] !== lcs[li])) {
      result.push('+' + afterLines[ai]);
      ai++;
    } else {
      result.push('-' + beforeLines[bi]);
      bi++;
    }
    if (result.length >= 200) break;
  }

  return result.filter(l => l[0] !== ' '); // Only changed lines in stored diff
}

/**
 * Score how significant a diff is (0.0 = noise, 1.0 = high confidence change).
 * Used to suppress low-signal alerts.
 */
export function scoreDiff(diffLines) {
  if (diffLines.length === 0) return 0;

  // Lines that contain price indicators are high value
  const priceLines = diffLines.filter(l =>
    /\$[\d,]+|\d+\/mo|\d+\/month|free|starter|pro|enterprise|price/i.test(l)
  ).length;

  const ratio = priceLines / diffLines.length;
  // Scale: pure price lines = 1.0, mixed = partial, no price lines = 0.2
  return Math.min(1.0, 0.2 + ratio * 0.8);
}

// ──────────────────────────────────────────────
// LCS helper (Patience diff, O(n log n) approx)
// ──────────────────────────────────────────────
function buildLCS(a, b) {
  const bIndex = new Map();
  b.forEach((line, i) => {
    if (!bIndex.has(line)) bIndex.set(line, []);
    bIndex.get(line).push(i);
  });

  const tails = []; // patience sorting
  const path = [];

  for (const line of a) {
    const positions = (bIndex.get(line) || []).slice().reverse();
    for (const pos of positions) {
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid].pos < pos) lo = mid + 1; else hi = mid;
      }
      tails[lo] = { pos, line, prev: lo > 0 ? tails[lo - 1] : null };
      path[lo] = tails[lo];
    }
  }

  // Reconstruct
  const lcs = [];
  let node = tails[tails.length - 1];
  while (node) { lcs.unshift(node.line); node = node.prev; }
  return lcs;
}

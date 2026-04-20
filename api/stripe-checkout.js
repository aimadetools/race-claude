/**
 * POST /api/stripe-checkout
 *
 * Creates a Stripe Checkout Session for a given plan.
 *
 * Request body:
 *   { planId: 'starter' | 'pro', userEmail: string }
 *
 * Response:
 *   200 { url: string }   — Checkout Session URL, redirect the user here
 *   400                   — Missing / invalid request body
 *   401                   — Missing or invalid Bearer token
 *   500                   — Stripe API error
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_PRICE_ID_STARTER
 *   STRIPE_PRICE_ID_PRO
 *   CHECKOUT_SECRET          — callers must send  Authorization: Bearer <CHECKOUT_SECRET>
 *   APP_URL                  — base URL for success/cancel redirects (e.g. https://pricepulse.app)
 */

const Stripe = require('stripe');

const PLAN_PRICE_MAP = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

module.exports = async function handler(req, res) {
  // ── Method guard ────────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Auth check ───────────────────────────────────────────────────────────────
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== process.env.CHECKOUT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── Input validation ─────────────────────────────────────────────────────────
  const { planId, userEmail } = req.body || {};

  if (!planId || !userEmail) {
    return res.status(400).json({ error: 'planId and userEmail are required' });
  }

  const priceId = PLAN_PRICE_MAP[planId];
  if (!priceId) {
    return res
      .status(400)
      .json({ error: `Unknown planId "${planId}". Valid values: starter, pro` });
  }

  // ── Create Checkout Session ──────────────────────────────────────────────────
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const baseUrl = process.env.APP_URL || 'https://pricepulse.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      metadata: {
        planId,
      },
      // Allow promotion codes so users can redeem discount codes at checkout
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[stripe-checkout] Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

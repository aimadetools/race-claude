// api/stripe-checkout.js — Vercel serverless function
// Creates a Stripe Checkout Session for plan upgrades.
// Auth via Supabase JWT (Authorization: Bearer <token>).
// The Supabase user ID is passed as Stripe metadata so the webhook
// can link the payment back to the correct user.
//
// POST /api/stripe-checkout { planId: 'starter' | 'pro' }
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_PRICE_ID_STARTER  — Stripe Price ID for the $19/mo plan
//   STRIPE_PRICE_ID_PRO      — Stripe Price ID for the $49/mo plan
//   SUPABASE_URL, SUPABASE_ANON_KEY (for JWT verification)
//   APP_URL                  — base URL for redirects (e.g. https://getpricepulse.com)

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PLAN_PRICE_MAP = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  // Authenticate user via Supabase JWT
  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  const { planId } = req.body || {};
  if (!planId) return res.status(400).json({ error: 'planId required' });

  const priceId = PLAN_PRICE_MAP[planId];
  if (!priceId) {
    return res.status(400).json({ error: `Unknown planId "${planId}". Valid: starter, pro` });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const baseUrl = process.env.APP_URL || 'https://race-claude.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing.html?checkout=cancelled`,
      allow_promotion_codes: true,
      metadata: {
        // Critical: webhook uses this to update the right Supabase user
        supabase_user_id: user.id,
        plan_id: planId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_id: planId,
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[stripe-checkout] Error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

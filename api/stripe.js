// api/stripe.js — Vercel serverless function
// Handles both Stripe checkout creation and webhook events.
//
// POST /api/stripe (checkout)
//   Body: { planId: 'starter' | 'pro' }
//   Auth: Supabase JWT via Authorization header
//
// POST /api/stripe (webhook)
//   Stripe webhook events (checkout.session.completed, subscription events, etc)
//   Auth: Stripe signature verification via stripe-signature header

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Detect if this is a webhook request (has stripe-signature header)
function isWebhookRequest(req) {
  return !!req.headers['stripe-signature'];
}

function getServiceClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );
}

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

function planFromPriceId(priceId) {
  if (!priceId) return 'free';
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return 'pro';
  return 'starter';
}

// ===== CHECKOUT HANDLER =====

const PLAN_PRICE_MAP = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

async function handleCheckout(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Authenticate user via Supabase JWT
  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  // Parse JSON body manually since bodyParser is disabled
  let body = {};
  if (req.body instanceof Buffer || typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body.toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  } else {
    body = req.body || {};
  }

  const { planId } = body;
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

// ===== WEBHOOK HANDLERS =====

async function handleCheckoutCompleted(session, supabase) {
  const userId = session.metadata?.supabase_user_id;
  const planId = session.metadata?.plan_id || planFromPriceId(session.line_items?.[0]?.price?.id);
  const stripeCustomerId = session.customer;
  const stripeSubscriptionId = session.subscription;

  if (!userId) {
    console.error('[stripe-webhook] checkout.session.completed: missing supabase_user_id in metadata');
    return;
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan: planId,
      status: 'active',
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('[stripe-webhook] checkout.session.completed update error:', error.message);
    throw error;
  }

  console.log(`[stripe-webhook] checkout.session.completed: user ${userId} → plan ${planId}`);
}

async function handleSubscriptionUpdated(subscription, supabase) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = planFromPriceId(priceId);
  const status = subscription.status === 'active' ? 'active' : subscription.status;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan,
      status,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) console.error('[stripe-webhook] subscription.updated error:', error.message);
  else console.log(`[stripe-webhook] subscription.updated: user ${userId} → plan ${plan}, status ${status}`);
}

async function handleSubscriptionDeleted(subscription, supabase) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan: 'free',
      status: 'canceled',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) console.error('[stripe-webhook] subscription.deleted error:', error.message);
  else console.log(`[stripe-webhook] subscription.deleted: user ${userId} → reverted to free`);
}

async function handlePaymentFailed(invoice, supabase) {
  const userId = invoice.subscription_details?.metadata?.supabase_user_id;
  if (!userId) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) console.error('[stripe-webhook] payment_failed error:', error.message);
  else console.warn(`[stripe-webhook] invoice.payment_failed: user ${userId} → past_due`);
}

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature header' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Read raw body for signature verification (from node request stream)
  let rawBody;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    rawBody = Buffer.concat(chunks);
  } catch (err) {
    return res.status(400).json({ error: 'Could not read request body' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature invalid: ${err.message}` });
  }

  const supabase = getServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabase);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabase);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabase);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, supabase);
        break;
      default:
        console.log(`[stripe-webhook] Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error(`[stripe-webhook] Handler error for ${event.type}:`, err.message);
    return res.status(500).json({ error: 'Internal handler error' });
  }

  return res.status(200).json({ received: true });
}

// ===== MAIN HANDLER =====

export const config = {
  api: { bodyParser: false }, // Required for Stripe signature verification on webhooks
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  // Route based on request type
  if (isWebhookRequest(req)) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({ error: 'Stripe webhook not configured' });
    }
    return handleWebhook(req, res);
  } else {
    return handleCheckout(req, res);
  }
}

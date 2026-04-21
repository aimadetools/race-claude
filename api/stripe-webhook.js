// api/stripe-webhook.js — Vercel serverless function
// Handles incoming Stripe webhook events.
//
// Supported events:
//   checkout.session.completed      → activate subscription (status: active)
//   customer.subscription.updated   → handle plan changes / renewals
//   customer.subscription.deleted   → cancel subscription (status: canceled)
//   invoice.payment_failed          → mark as past_due
//
// IMPORTANT: Vercel doesn't parse the body for this endpoint — we need the raw
// buffer for Stripe signature verification. Configured via vercel.json bodyParser=false.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET  — signing secret from Stripe Dashboard → Webhooks
//   SUPABASE_URL, SUPABASE_SERVICE_KEY

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );
}

function planFromPriceId(priceId) {
  if (!priceId) return 'free';
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return 'pro';
  return 'starter'; // default to starter if unknown
}

// checkout.session.completed — user just paid
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

// customer.subscription.updated — renewal, plan change, etc.
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

// customer.subscription.deleted — cancellation
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

// invoice.payment_failed
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

export const config = {
  api: { bodyParser: false }, // Required for Stripe signature verification
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature header' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Read raw body for signature verification
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

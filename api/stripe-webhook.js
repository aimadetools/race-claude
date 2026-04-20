/**
 * POST /api/stripe-webhook
 *
 * Handles incoming Stripe webhook events.
 *
 * Supported events:
 *   checkout.session.completed      → upsert subscription (status: active)
 *   customer.subscription.deleted   → update subscription (status: cancelled)
 *   invoice.payment_failed          → update subscription (status: past_due), log failure
 *
 * All other event types receive an immediate 200 OK (acknowledged, not processed).
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET     — signing secret from the Stripe dashboard webhook endpoint
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY      — service-role key (bypasses RLS)
 *
 * IMPORTANT: The raw request body must be available as req.rawBody (Buffer) for
 * signature verification. With Express, use express.raw({ type: 'application/json' })
 * on this route BEFORE calling express.json() globally.
 */

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// ── Helpers ────────────────────────────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );
}

/**
 * Derive the plan name ('starter' | 'pro' | 'unknown') from a Stripe price ID
 * by comparing against the same env vars used in stripe-checkout.js.
 */
function planFromPriceId(priceId) {
  if (!priceId) return 'unknown';
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return 'pro';
  return 'unknown';
}

// ── Event handlers ─────────────────────────────────────────────────────────────

/**
 * checkout.session.completed
 * Upsert a subscription record so we know the user is now active.
 */
async function handleCheckoutSessionCompleted(session, supabase) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const customerEmail = session.customer_email || session.customer_details?.email;
  const planId = session.metadata?.planId || 'unknown';

  const { error } = await supabase.from('subscriptions').upsert(
    {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      email: customerEmail,
      plan: planId,
      status: 'active',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_customer_id' }
  );

  if (error) {
    console.error('[stripe-webhook] checkout.session.completed upsert error:', error.message);
    throw error;
  }

  console.log(
    `[stripe-webhook] checkout.session.completed: customer ${customerId} activated on plan "${planId}"`
  );
}

/**
 * customer.subscription.deleted
 * Mark the subscription as cancelled in Supabase.
 */
async function handleSubscriptionDeleted(subscription, supabase) {
  const customerId = subscription.customer;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('[stripe-webhook] customer.subscription.deleted update error:', error.message);
    throw error;
  }

  console.log(
    `[stripe-webhook] customer.subscription.deleted: customer ${customerId} subscription cancelled`
  );
}

/**
 * invoice.payment_failed
 * Mark the subscription as past_due and log the failure details.
 */
async function handleInvoicePaymentFailed(invoice, supabase) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  const attemptCount = invoice.attempt_count;
  const nextPaymentAttempt = invoice.next_payment_attempt
    ? new Date(invoice.next_payment_attempt * 1000).toISOString()
    : null;

  // Update subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('[stripe-webhook] invoice.payment_failed update error:', error.message);
    throw error;
  }

  // Log the failure for auditing / debugging
  console.warn(
    '[stripe-webhook] invoice.payment_failed:',
    JSON.stringify({
      customerId,
      subscriptionId,
      invoiceId: invoice.id,
      attemptCount,
      nextPaymentAttempt,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
    })
  );
}

// ── Main handler ───────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Signature verification ───────────────────────────────────────────────────
  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    // req.rawBody must be the raw Buffer — configure your framework accordingly.
    const rawBody = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  // ── Dispatch ─────────────────────────────────────────────────────────────────
  const supabase = getSupabase();

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabase);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, supabase);
        break;

      default:
        // Acknowledge unhandled events immediately — no processing needed.
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] Handler error for event ${event.type}:`, err.message);
    // Return 500 so Stripe retries the delivery.
    return res.status(500).json({ error: 'Internal handler error' });
  }

  return res.status(200).json({ received: true });
};

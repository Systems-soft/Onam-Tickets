/**
 * Vercel Serverless Function: Stripe Webhook Handler
 * 
 * This is a Vercel-compatible wrapper around the existing webhook logic.
 * Vercel requires special configuration for raw body parsing on webhook endpoints.
 */

const stripe = require('../lib/stripe');
const { saveOrder, hasProcessed, markProcessed } = require('../lib/orders');

/**
 * Vercel requires special configuration to disable automatic body parsing
 * for webhook verification. Add this to vercel.json:
 * 
 * {
 *   "functions": {
 *     "api/stripe-webhook.js": {
 *       "memory": 128,
 *       "maxDuration": 30
 *     }
 *   }
 * }
 */

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    // Signature verification failed — do NOT trust this request.
    console.error('[stripe-webhook] signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency: Stripe may deliver the same event more than once
  // (retries, duplicate sends, etc). Skip if we've already handled it.
  if (hasProcessed(event.id)) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // The webhook is the source of truth for payment success — the
      // browser reaching the success page is NOT sufficient on its own.
      const isPaid =
        session.payment_status === 'paid' || session.status === 'complete';

      if (isPaid) {
        const order = {
          status: 'paid',
          stripeSessionId: session.id,
          stripeEventId: event.id,
          amountTotalCents: session.amount_total,
          currency: session.currency,
          customerEmail:
            session.customer_details?.email || session.customer_email || null,
          customerName: session.customer_details?.name || null,
          tickets: session.metadata?.tickets || null,
          createdAt: new Date().toISOString(),
        };
        saveOrder(order);
      } else {
        console.log('[stripe-webhook] session not paid, status:', session.payment_status);
      }
    }

    // Other event types (e.g. checkout.session.expired,
    // payment_intent.payment_failed) can be handled here later if needed.

    markProcessed(event.id);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err);
    // Returning a 500 tells Stripe to retry the event later.
    return res.status(500).send('Webhook handler error');
  }
};

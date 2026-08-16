const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  // Don't throw at import time in a way that crashes the whole bundle silently —
  // the individual route handlers will surface a clear 500 error instead.
  console.warn('[stripe] STRIPE_SECRET_KEY is not set.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

module.exports = stripe;

const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[⚠️  stripe.js] STRIPE_SECRET_KEY is not configured in .env file');
  console.warn('   → Copy your test key from https://dashboard.stripe.com/test/keys');
  console.warn('   → Edit .env and set STRIPE_SECRET_KEY=sk_test_your_key_here');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

module.exports = stripe;

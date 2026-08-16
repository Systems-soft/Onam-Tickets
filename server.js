require('dotenv').config();
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createCheckoutSession = require('./lib/create-checkout-session');
const stripeWebhook = require('./lib/stripe-webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Parse JSON for most routes
app.use(bodyParser.json());

// Middleware: Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route: Create checkout session
app.post('/api/create-checkout-session', createCheckoutSession);

// Route: Stripe webhook (with raw body for signature verification)
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'onam-tickets.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 Make sure to set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env\n`);
});

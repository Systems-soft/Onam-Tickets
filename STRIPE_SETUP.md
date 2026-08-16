# 🛠️ Stripe Setup Guide for Onam Tickets

## Quick Start

### Step 1: Create/Access Stripe Account
- Go to https://stripe.com and create a free account
- Verify your email address

### Step 2: Get Your API Keys
1. Log in to Stripe Dashboard: https://dashboard.stripe.com
2. Make sure you're in **TEST MODE** (toggle in top-right)
3. Click **Developers** → **API keys**
4. You'll see:
   - **Secret Key** - Starts with `sk_test_` (keep this secret!)
   - **Publishable Key** - Starts with `pk_test_` (okay to share)

### Step 3: Update .env File
Replace the values in `e:\Onam-Ticket\.env`:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET_HERE
```

Example (DO NOT USE - these are fake):
```env
STRIPE_SECRET_KEY=[REDACTED_STRIPE_TEST_SECRET]
STRIPE_WEBHOOK_SECRET=whsec_test_123abc456def789ghi012jkl
```

### Step 4: Set Up Webhooks (for payment notifications)
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter:
   - **URL**: `http://localhost:5000/api/stripe-webhook`
   - **Events to send**: `checkout.session.completed`
4. Click **Add endpoint**
5. On the webhook details page, click **Reveal** to see the signing secret
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
   ```

### Step 5: Restart the Server
```bash
cd e:\Onam-Ticket
npm start
```

## Testing Payments

### Test Card Numbers (in TEST MODE only)
Use these fake card numbers to test:

| Card Type | Number | Expiry | CVC |
|-----------|--------|--------|-----|
| Visa | 4242 4242 4242 4242 | 12/34 | 567 |
| Visa (decline) | 4000 0000 0000 0002 | 12/34 | 567 |
| Amex | 3782 822463 10005 | 12/34 | 1234 |

- **Expiry Date**: Any future date (e.g., 12/34)
- **CVC**: Any 3-4 digits

### Test Purchase Flow
1. Navigate to http://localhost:5000
2. Click "Add to order" on a ticket
3. Click "Reserve tickets"
4. Enter test card number (e.g., 4242 4242 4242 4242)
5. Fill in expiry and CVC
6. Complete the purchase

### View Test Orders
Orders are logged to the server console (stored in memory - they'll disappear on server restart).

## Troubleshooting

### "Invalid API Key" Error
- ❌ The key in `.env` is wrong or incomplete
- ✅ Copy the exact key from Stripe Dashboard → Developers → API Keys
- ✅ Make sure you're copying the **Secret Key** (sk_test_), not the Publishable Key

### "Webhook authentication failed"
- ❌ The webhook secret is wrong
- ✅ Verify you copied it from the webhook endpoint, not from general API keys page
- ✅ Restart the server after updating `.env`

### Payments not being recorded
- ❌ Webhook may not be set up correctly
- ✅ Check Stripe Dashboard → Developers → Webhooks for delivery status
- ✅ Make sure the webhook endpoint URL is exactly: `http://localhost:5000/api/stripe-webhook`

## Production Deployment

Before going live:
1. Switch to **LIVE MODE** in Stripe Dashboard
2. Use **Live Keys** (not test keys) - starts with `sk_live_`
3. Keep secret keys secure (never commit to git!)
4. Use environment variables or secrets manager for production
5. Set up a real database to persist orders (currently stored in memory)

## Support
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

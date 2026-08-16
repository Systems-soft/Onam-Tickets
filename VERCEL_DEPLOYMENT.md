# Vercel Deployment Guide — Onam Tickets Website

## Project Structure for Vercel

```
.
├── api/
│   ├── create-checkout-session.js  (Vercel Serverless Function)
│   └── stripe-webhook.js           (Vercel Serverless Function)
├── lib/
│   ├── stripe.js                   (Stripe client)
│   ├── tickets.js                  (Ticket catalog)
│   ├── orders.js                   (Order storage)
│   └── create-checkout-session.js  (Checkout logic - legacy local file)
│   └── stripe-webhook.js           (Webhook logic - legacy local file)
├── onam-tickets.html               (Main page - served at /)
├── payment-success.html            (Success page)
├── payment-cancelled.html          (Cancel page)
├── server.js                       (Local development only)
├── package.json
├── vercel.json                     (Vercel configuration)
└── .env                            (Environment variables)
```

## Files Changed/Created for Vercel

### New Files Created
- `api/create-checkout-session.js` — Vercel serverless function for checkout
- `api/stripe-webhook.js` — Vercel serverless function for webhook
- `vercel.json` — Vercel configuration

### Files Modified
- `package.json` — Added `vercel-build` script

### Files Kept (No Changes)
- `lib/stripe.js` — Stripe client
- `lib/tickets.js` — Ticket catalog  
- `lib/orders.js` — Order storage
- `onam-tickets.html` — Main page
- `payment-success.html` — Success page
- `payment-cancelled.html` — Cancel page
- `server.js` — Local development only (not used on Vercel)

### Files Not Needed for Vercel
- `lib/create-checkout-session.js` — Logic moved to `api/create-checkout-session.js`
- `lib/stripe-webhook.js` — Logic moved to `api/stripe-webhook.js`

## Environment Variables Required

Set these in Vercel Project Settings → Environment Variables:

```
STRIPE_SECRET_KEY = sk_test_YOUR_TEST_SECRET_KEY
STRIPE_WEBHOOK_SECRET = whsec_test_YOUR_WEBHOOK_SECRET
SITE_URL = (optional) - Use for custom domain, otherwise Vercel URL is used
```

**Important**: Use test keys for initial deployment (`sk_test_*` and `whsec_test_*`)

## Vercel Configuration (vercel.json)

The `vercel.json` file handles:
- **rewrites**: Serves `onam-tickets.html` at root URL `/`
- **functions**: Configures webhook function for raw body handling
- **env**: Declares required environment variables

## Deployment Steps

### 1. Prepare Git Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel
```

Or connect via Vercel Dashboard at https://vercel.com

### 3. Set Environment Variables in Vercel
1. Go to Vercel Project Settings → Environment Variables
2. Add `STRIPE_SECRET_KEY` (test key from Stripe Dashboard)
3. Add `STRIPE_WEBHOOK_SECRET` (from Stripe Webhook settings)
4. Redeploy to apply environment variables

### 4. Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-domain.vercel.app/api/stripe-webhook`
4. Events: Select `checkout.session.completed`
5. Copy Signing Secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 5. Test the Deployment
- Visit `https://your-vercel-domain.vercel.app/`
- Add tickets to cart
- Click "Reserve tickets"
- Test with Stripe test card: `4242 4242 4242 4242`
- Verify success page appears

## How It Works on Vercel

### Frontend Flow
1. User visits `https://your-domain.vercel.app/` → Vercel serves `onam-tickets.html`
2. User adds tickets to cart (client-side JavaScript)
3. User clicks "Reserve tickets" → POST to `/api/create-checkout-session`

### Checkout API (`api/create-checkout-session.js`)
1. Vercel automatically parses JSON body
2. Function validates ticket IDs server-side
3. Function looks up prices from `lib/tickets.js`
4. Ignores client-supplied prices (security)
5. Creates Stripe Checkout Session
6. Returns checkout URL to frontend
7. Frontend redirects to Stripe Checkout

### Webhook (`api/stripe-webhook.js`)
1. Stripe sends event to `https://your-domain.vercel.app/api/stripe-webhook`
2. Function verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
3. Processes `checkout.session.completed` event
4. Records order in memory (or database when integrated)
5. Returns 200 to acknowledge receipt

### Redirect Flow
1. After payment, Stripe redirects to success/cancel page
2. Success page: `https://your-domain.vercel.app/payment-success.html?session_id=...`
3. Cancel page: `https://your-domain.vercel.app/payment-cancelled.html`

## Verification Checklist

Before deploying to production:

- ✅ Website loads at `https://your-domain.vercel.app/`
- ✅ Ticket page loads with all tickets visible
- ✅ Add to Cart works
- ✅ Cart updates correctly
- ✅ Reserve tickets button works
- ✅ Stripe Checkout opens
- ✅ Test payment succeeds with `4242 4242 4242 4242`
- ✅ Success page appears with session ID
- ✅ Browser network tab shows `/api/create-checkout-session` returns `{ url: "..." }`
- ✅ No Stripe secret key appears in browser console or network requests
- ✅ Webhook endpoint is registered in Stripe Dashboard
- ✅ Cancel button returns to cancel page

## Troubleshooting

### "Invalid API Key" Error
- Check `STRIPE_SECRET_KEY` is set in Vercel Environment Variables
- Verify it's a test key (`sk_test_*`)
- Redeploy after adding environment variables

### Webhook Not Receiving Events
- Verify webhook endpoint in Stripe Dashboard matches exactly:
  `https://your-domain.vercel.app/api/stripe-webhook`
- Check Stripe webhook logs for delivery status
- Verify `STRIPE_WEBHOOK_SECRET` is correct

### Static Files Not Loading
- Verify all HTML files are in root directory
- Check that files are included in Vercel deployment (check `.vercelignore` if present)

### Root URL Not Loading Correct Page
- Verify `vercel.json` has correct rewrite rule
- Check Vercel deployment logs for rewrite errors

## Production Deployment

When going live (not recommended for this test):

1. Switch Stripe to **Live Mode**
2. Use **Live API Keys** (`sk_live_*`)
3. Update `STRIPE_SECRET_KEY` and webhook secret in Vercel
4. Implement persistent database for orders (currently in-memory)
5. Add SSL certificate verification if needed
6. Set up monitoring and error tracking

## Local Development with Vercel

To test locally before deploying:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Run local Vercel environment
vercel dev

# Starts on http://localhost:3000
# Simulates Vercel environment locally
```

This runs:
- API functions from `/api` directory
- Static files from root
- Uses local `.env` file for environment variables

## Notes

- Frontend code does NOT include Stripe secret key
- All price validation happens server-side
- Webhook provides payment confirmation (not browser redirect)
- Orders stored in memory (plans exist to integrate database)
- Vercel Serverless Functions have 10-second cold start timeout by default
- Webhook function has 30-second timeout (configured in `vercel.json`)

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs
- Stripe Webhook Events: https://stripe.com/docs/api/events/types

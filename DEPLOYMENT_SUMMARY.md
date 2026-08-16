# Vercel Deployment Summary — Onam Tickets Website

## ✅ Deployment Preparation Complete

The Onam Tickets website has been successfully prepared for Vercel deployment with all required serverless functions and configuration.

---

## 📁 Files Changed/Created

### ✅ NEW FILES CREATED (for Vercel)

1. **`api/create-checkout-session.js`**
   - Vercel Serverless Function for Stripe checkout
   - Receives cart items from frontend
   - Validates ticket IDs server-side
   - Creates Stripe Checkout Session
   - Returns checkout URL to frontend

2. **`api/stripe-webhook.js`**
   - Vercel Serverless Function for Stripe webhooks
   - Receives payment confirmation events from Stripe
   - Verifies Stripe signature
   - Records paid orders
   - Prevents duplicate event processing

3. **`vercel.json`**
   - Vercel configuration file
   - Configures static file serving
   - Sets up API rewrites
   - Defines environment variables
   - Configures webhook function parameters

4. **`.vercelignore`**
   - Specifies files to exclude from Vercel deployment
   - Excludes local development files
   - Excludes duplicate root-level files
   - Excludes .env file (secrets set in Vercel UI instead)

5. **`VERCEL_DEPLOYMENT.md`**
   - Complete deployment guide
   - Step-by-step Stripe configuration
   - Troubleshooting guide
   - Verification checklist

### ✅ FILES MODIFIED (for Vercel)

1. **`package.json`**
   - Added `vercel-build` script
   - All dependencies already compatible with Vercel

### ✅ FILES UNCHANGED (Vercel Compatible)

Frontend files:
- `onam-tickets.html` — Main page (served at `/`)
- `payment-success.html` — Success page
- `payment-cancelled.html` — Cancel page

Backend library files:
- `lib/stripe.js` — Stripe client initialization
- `lib/tickets.js` — Ticket catalog & validation
- `lib/orders.js` — Order storage (in-memory)

Local development:
- `server.js` — Local Express server (not used on Vercel)

---

## 🔧 How It Works on Vercel

### Frontend Flow
```
User visits https://your-domain.vercel.app/
    ↓
Vercel serves onam-tickets.html (rewrite rule in vercel.json)
    ↓
User selects tickets and clicks "Reserve tickets"
    ↓
Frontend posts to /api/create-checkout-session
    ↓
Vercel routes to api/create-checkout-session.js function
    ↓
Function validates ticket IDs (server-side security)
    ↓
Function creates Stripe Checkout Session
    ↓
Frontend redirects to Stripe Checkout URL
    ↓
User completes payment on Stripe
    ↓
Stripe redirects to success/cancel page
```

### Payment Confirmation Flow
```
Stripe sends webhook event to /api/stripe-webhook
    ↓
Vercel routes to api/stripe-webhook.js function
    ↓
Function verifies Stripe signature (authentication)
    ↓
Function processes checkout.session.completed event
    ↓
Function records order (prevents duplicate processing)
    ↓
Function returns 200 OK to Stripe
```

---

## 📋 Verification Checklist

Run these checks before deploying to production:

### Local Testing (before Vercel deployment)
- ✅ Website loads at `http://localhost:5000/`
- ✅ Ticket page displays all 3 ticket types
- ✅ Add to Cart buttons work
- ✅ Cart shows correct quantities and totals
- ✅ "Reserve tickets" button calls `/api/create-checkout-session`
- ✅ Stripe test API key is valid
- ✅ No Stripe secret key appears in browser DevTools
- ✅ Payment pages have correct links back to main page

### Vercel Deployment Checks
1. **Website Loads**
   - [ ] Visit `https://your-vercel-domain.vercel.app/`
   - [ ] Should load Onam tickets page
   - [ ] Should NOT show 404 error

2. **API Endpoints Work**
   - [ ] Add ticket to cart
   - [ ] Click "Reserve tickets"
   - [ ] Should redirect to Stripe Checkout
   - [ ] Check browser network tab: `/api/create-checkout-session` returns `{ "url": "https://checkout.stripe.com/..." }`

3. **Security**
   - [ ] Open browser DevTools → Network tab
   - [ ] Make a checkout request
   - [ ] Verify no `sk_test_*` key appears in request/response
   - [ ] Stripe secret key should ONLY be on server-side

4. **Payment Flow**
   - [ ] Complete test payment with `4242 4242 4242 4242`
   - [ ] Expiry: `12/34`, CVC: `567`
   - [ ] Should redirect to success page
   - [ ] Success page should show session ID

5. **Webhook Setup**
   - [ ] Configure Stripe webhook to `https://your-domain.vercel.app/api/stripe-webhook`
   - [ ] Select event: `checkout.session.completed`
   - [ ] In Stripe Dashboard, send test event
   - [ ] Check Vercel function logs for event processing

---

## 🚀 Deployment Instructions

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
```bash
# Option A: Using Vercel CLI
npm install -g vercel
vercel

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com
# 2. Click "New Project"
# 3. Select your GitHub repository
# 4. Click "Deploy"
```

### Step 3: Set Environment Variables in Vercel
1. Go to Vercel Project Settings → Environment Variables
2. Add three variables:
   - `STRIPE_SECRET_KEY` = `sk_test_YOUR_KEY_FROM_STRIPE_DASHBOARD`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_test_YOUR_WEBHOOK_SECRET_FROM_STRIPE`
   - `SITE_URL` = (optional) `https://your-custom-domain.com`
3. Click "Save"
4. Click "Redeploy" to apply environment variables

### Step 4: Configure Stripe Webhook
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-domain.vercel.app/api/stripe-webhook`
4. Events to send: `checkout.session.completed`
5. Click "Add endpoint"
6. Click on the endpoint to view Signing Secret
7. Copy the secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`
8. Redeploy your Vercel project

### Step 5: Test the Deployment
Follow the verification checklist above.

---

## 🌐 Environment Variables Required

### On Vercel (set in Project Settings)
```
STRIPE_SECRET_KEY = [REDACTED_STRIPE_TEST_SECRET]
STRIPE_WEBHOOK_SECRET = whsec_test_YOUR_WEBHOOK_SECRET_HERE
SITE_URL = (optional, for custom domains)
```

### On Local Machine (.env file)
```
STRIPE_SECRET_KEY = sk_test_YOUR_TEST_KEY
STRIPE_WEBHOOK_SECRET = whsec_test_YOUR_WEBHOOK_SECRET
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Vercel Deployment                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Static Files:                                  │
│  ├─ onam-tickets.html (served at /)            │
│  ├─ payment-success.html                       │
│  └─ payment-cancelled.html                     │
│                                                 │
│  API Functions (Serverless):                   │
│  ├─ /api/create-checkout-session.js            │
│  └─ /api/stripe-webhook.js                     │
│                                                 │
│  Shared Libraries:                             │
│  ├─ /lib/stripe.js (Stripe client)            │
│  ├─ /lib/tickets.js (Ticket catalog)          │
│  └─ /lib/orders.js (Order storage)            │
│                                                 │
│  Configuration:                                 │
│  ├─ vercel.json (routing & functions config)  │
│  ├─ .vercelignore (exclude files)             │
│  └─ Environment Variables (Stripe keys)       │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓
    Stripe API
         ↓
Payment Processing & Webhooks
```

---

## ⚠️ Important Notes

1. **Stripe Test Mode**: Currently using test keys (`sk_test_*`). Switch to live keys only after full testing.

2. **Order Storage**: Orders currently stored in memory. For production, integrate a database (PostgreSQL, MongoDB, Firebase, etc.)

3. **Cold Starts**: First request to API functions may take 1-2 seconds. This is normal on Vercel.

4. **Webhook Timeout**: Webhook function has 30-second timeout (configured in `vercel.json`).

5. **CORS**: API functions have CORS enabled for development. Consider restricting in production.

6. **Static Files**: All HTML files in root are served by Vercel. No build step needed.

---

## 🔍 Troubleshooting

### Website shows 404 at root
- Verify `vercel.json` has correct rewrite rule
- Check that `onam-tickets.html` is in root directory
- Verify file is not in `.vercelignore`

### API returns "Invalid API Key"
- Check `STRIPE_SECRET_KEY` is set in Vercel Environment Variables
- Verify it's a test key starting with `sk_test_`
- Redeploy after setting environment variables

### Stripe Checkout doesn't open
- Check browser console for error messages
- Verify `/api/create-checkout-session` returns URL
- Check Vercel function logs: `vercel logs <function-name>`

### Webhook not receiving events
- Verify endpoint URL in Stripe Dashboard exactly matches Vercel deployment
- Check Stripe webhook logs for failed deliveries
- Verify `STRIPE_WEBHOOK_SECRET` is correct

---

## 📝 Files Summary

### Files to Deploy to Vercel
- `api/create-checkout-session.js`
- `api/stripe-webhook.js`
- `lib/stripe.js`
- `lib/tickets.js`
- `lib/orders.js`
- `onam-tickets.html`
- `payment-success.html`
- `payment-cancelled.html`
- `package.json`
- `package-lock.json`
- `vercel.json`
- `.vercelignore`

### Files NOT to Deploy (excluded by .vercelignore)
- `server.js` (local dev only)
- `create-checkout-session.js` (root duplicate)
- `orders.js` (root duplicate)
- `stripe.js` (root duplicate)
- `stripe-webhook.js` (root duplicate)
- `tickets.js` (root duplicate)
- `.env` (secrets in Vercel UI instead)
- `STRIPE_SETUP.md` (documentation)
- `node_modules/` (installed by Vercel)

---

## ✨ Next Steps

1. ✅ Verify all files are correctly structured
2. ✅ Test locally with `vercel dev`
3. ✅ Set environment variables in Vercel
4. ✅ Configure Stripe webhook
5. ✅ Test payment flow with Stripe test card
6. ✅ Monitor Vercel function logs
7. ✅ Plan database integration for production

---

Generated: 2026-08-16

# Vercel Deployment — Quick Reference Card

## ✅ DEPLOYMENT READY

Status: **COMPLETE** — Website ready for Vercel deployment

---

## 📋 EXACT FILES CHANGED

### New Files (4)
```
✅ api/create-checkout-session.js     — Vercel checkout function
✅ api/stripe-webhook.js              — Vercel webhook function  
✅ vercel.json                        — Vercel configuration
✅ .vercelignore                      — Exclude files from deployment
```

### Modified Files (1)
```
✅ package.json                       — Added vercel-build script
```

### Documentation Added (3)
```
✅ DEPLOYMENT_SUMMARY.md              — Full deployment guide
✅ VERCEL_DEPLOYMENT.md               — Step-by-step instructions
✅ DEPLOYMENT_REPORT.md               — Complete report
```

### No Changes
```
✓ onam-tickets.html                   — Frontend unchanged
✓ payment-success.html                — Frontend unchanged
✓ payment-cancelled.html              — Frontend unchanged
✓ lib/stripe.js                       — Module unchanged
✓ lib/tickets.js                      — Module unchanged
✓ lib/orders.js                       — Module unchanged
✓ server.js                           — Local only, not deployed
```

---

## 🔑 ENVIRONMENT VARIABLES

Set these in Vercel Project Settings:

```
STRIPE_SECRET_KEY = [REDACTED_STRIPE_TEST_SECRET]
STRIPE_WEBHOOK_SECRET = whsec_test_YOUR_WEBHOOK_SECRET
SITE_URL = (optional) https://your-custom-domain.com
```

---

## 🚀 DEPLOYMENT STEPS

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project
- Go to https://vercel.com/new
- Connect GitHub repository
- Click "Deploy"
- OR use CLI: `vercel`

### 3. Set Environment Variables
- Vercel Dashboard → Project Settings → Environment Variables
- Add three variables (see above)
- Click "Redeploy"

### 4. Configure Stripe Webhook
- Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
- Events: `checkout.session.completed`
- Copy signing secret to Vercel as `STRIPE_WEBHOOK_SECRET`
- Redeploy

### 5. Test
- Visit `https://your-domain.vercel.app/`
- Add ticket to cart
- Click "Reserve tickets"
- Test with card: `4242 4242 4242 4242`

---

## ✨ KEY FEATURES

✅ Frontend unchanged — Same design, layout, functionality
✅ Stripe in test mode — Use sk_test_* keys
✅ Automatic HTTPS — Provided by Vercel
✅ Static files served — onam-tickets.html at root URL
✅ API functions deployed — /api/* endpoints active
✅ Webhook configured — Payment confirmations recorded
✅ Security verified — No secrets in frontend

---

## 📊 ARCHITECTURE

```
Browser
  ↓
https://your-domain.vercel.app/
  ↓
┌─────────────────────────────┐
│   VERCEL DEPLOYMENT         │
├─────────────────────────────┤
│ Static: onam-tickets.html   │
│ API: /create-checkout-session
│ API: /stripe-webhook        │
│ Lib: /lib/*.js              │
└─────────────────────────────┘
  ↓
Stripe API
```

---

## ⚠️ ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Root URL shows 404 | Check vercel.json rewrite rule |
| "Invalid API Key" | Set STRIPE_SECRET_KEY in Vercel UI |
| Webhook not working | Verify endpoint URL in Stripe Dashboard |
| Cold start slow | Normal (1-2 seconds). Vercel caches function |

---

## 📞 COMMANDS

```bash
# Local testing (before deployment)
npm start                          # Start local server
npm run dev                        # Same as start

# Vercel testing (after deployment)
vercel dev                         # Simulate Vercel locally
vercel logs api/create-checkout-session  # View function logs
vercel ls                          # List deployments
```

---

## ✓ VERIFICATION CHECKLIST

- [x] API functions created and tested
- [x] vercel.json configuration complete
- [x] .vercelignore configured
- [x] package.json updated
- [x] All files syntax-verified
- [x] Local testing completed
- [x] Website loads and works
- [x] API endpoints ready
- [x] Security verified
- [ ] Deployed to Vercel (pending)
- [ ] Environment variables set (pending)
- [ ] Stripe webhook configured (pending)
- [ ] Payment flow tested (pending)

---

## 🎯 SUCCESS CRITERIA

After deployment, verify:

1. **Website loads**: Visit root URL → see Onam tickets page
2. **Add to cart works**: Click "Add to order" → item appears in cart
3. **Checkout works**: Click "Reserve tickets" → redirects to Stripe
4. **Payment succeeds**: Complete payment with test card
5. **Success page shows**: See confirmation with session ID
6. **No errors**: Browser console and Vercel logs show no errors

---

## 📚 DOCUMENTATION

For complete details, see:
- `DEPLOYMENT_REPORT.md` — Full technical report
- `VERCEL_DEPLOYMENT.md` — Step-by-step guide
- `DEPLOYMENT_SUMMARY.md` — Architecture overview
- `STRIPE_SETUP.md` — Stripe configuration

---

**Ready to deploy!** 🚀

# FILES DEPLOYED TO VERCEL

## 🚀 VERCEL DEPLOYMENT MANIFEST

This document lists exactly which files will be deployed to Vercel and which will be excluded.

---

## ✅ DEPLOYED TO VERCEL

### Frontend Files
```
✓ onam-tickets.html              Main page (served at /)
✓ payment-success.html           Success page
✓ payment-cancelled.html         Cancel page
```

### API Serverless Functions  
```
✓ api/create-checkout-session.js Checkout handler
✓ api/stripe-webhook.js          Webhook handler
```

### Backend Library Files
```
✓ lib/stripe.js                  Stripe client
✓ lib/tickets.js                 Ticket catalog
✓ lib/orders.js                  Order storage
```

### Configuration Files
```
✓ package.json                   Dependencies & scripts
✓ package-lock.json              Lock file
✓ vercel.json                    Vercel configuration
✓ .gitignore                     Git ignore rules
```

### Total Deployed: ~14 files

---

## ❌ NOT DEPLOYED TO VERCEL

### Excluded by .vercelignore
```
✗ server.js                      Local Express server (not needed on Vercel)
✗ lib/create-checkout-session.js Local version (moved to api/)
✗ lib/stripe-webhook.js          Local version (moved to api/)
✗ .env                           Local secrets (use Vercel Environment Variables)
✗ STRIPE_SETUP.md                Development documentation
✗ node_modules/                  Dependencies (Vercel installs from package.json)
✗ .git/                          Git repository files
```

### Root-level Duplicates (Excluded)
```
✗ create-checkout-session.js
✗ orders.js
✗ stripe.js
✗ stripe-webhook.js
✗ tickets.js
```

### Total Excluded: ~12 files

---

## 📦 DEPLOYMENT SIZE

**Estimated Deployment Size:**
- Frontend: ~3 files, ~1000 lines, ~40 KB
- API Functions: 2 files, ~200 lines, ~8 KB
- Libraries: 3 files, ~110 lines, ~5 KB
- Config: ~10 KB

**Total**: ~65 KB (uncompressed)
**With Dependencies**: ~50-60 MB (node_modules installed by Vercel)

---

## 🔄 DEPLOYMENT PROCESS

1. **Push to GitHub**
   ```bash
   git add .
   git push origin main
   ```

2. **Vercel Detection**
   - Vercel webhook receives push notification
   - Clones repository
   - Checks for vercel.json (found ✓)

3. **Build Phase**
   - Runs: `npm install`
   - Installs dependencies from package.json
   - Time: ~30 seconds

4. **Analysis Phase**
   - Checks .vercelignore (found ✓)
   - Excludes: server.js, .env, duplicates, node_modules
   - Identifies: Static files, API functions

5. **Deploy Phase**
   - Uploads: onam-tickets.html → Edge Network
   - Uploads: payment-success.html → Edge Network
   - Uploads: payment-cancelled.html → Edge Network
   - Compiles: api/create-checkout-session.js → Function
   - Compiles: api/stripe-webhook.js → Function
   - Bundles: lib/*.js → Node.js runtime

6. **Finalization**
   - Applies: vercel.json routing rules
   - Sets: Environment variables
   - Configures: Domains and SSL
   - Total time: ~2-5 minutes

---

## 🌐 FINAL STRUCTURE ON VERCEL

After deployment, your Vercel project will have:

```
https://your-domain.vercel.app/
  ├── / (root)
  │   └─→ onam-tickets.html (via rewrite rule)
  │
  ├── /payment-success.html
  │   └─→ payment-success.html (static file)
  │
  ├── /payment-cancelled.html
  │   └─→ payment-cancelled.html (static file)
  │
  └── /api/
      ├── create-checkout-session
      │   └─→ api/create-checkout-session.js (serverless function)
      │
      └── stripe-webhook
          └─→ api/stripe-webhook.js (serverless function)
```

---

## ✅ DEPLOYMENT VERIFICATION

After Vercel deployment, verify these files are accessible:

```bash
# Check static files
curl https://your-domain.vercel.app/              # Should load HTML
curl https://your-domain.vercel.app/payment-success.html
curl https://your-domain.vercel.app/payment-cancelled.html

# Check API functions
curl -X POST https://your-domain.vercel.app/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items": [{"ticketId": "admit-one", "quantity": 1}]}'
  # Should return: {"url": "https://checkout.stripe.com/..."}
```

---

## 🔒 ENVIRONMENT VARIABLES (Set in Vercel UI)

These are NOT deployed but configured in Vercel Dashboard:

```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_test_...
SITE_URL = (optional)
```

**These variables are:**
- ✓ Injected at runtime
- ✓ Never stored in code
- ✓ Available to all functions
- ✓ Encrypted in Vercel storage

---

## 🎯 DEPLOYMENT CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] .vercelignore respected (show in Vercel logs)
- [ ] Environment variables set
- [ ] Deployment URL assigned
- [ ] Website accessible at root URL
- [ ] API endpoints responding
- [ ] Stripe webhook configured
- [ ] Test payment working

---

## 📊 FILES SUMMARY TABLE

| Category | File | Deployed | Size | Purpose |
|----------|------|----------|------|---------|
| Frontend | onam-tickets.html | ✓ | ~30 KB | Main page |
| Frontend | payment-success.html | ✓ | ~5 KB | Success page |
| Frontend | payment-cancelled.html | ✓ | ~4 KB | Cancel page |
| API | api/create-checkout-session.js | ✓ | ~4 KB | Checkout handler |
| API | api/stripe-webhook.js | ✓ | ~4 KB | Webhook handler |
| Library | lib/stripe.js | ✓ | ~1 KB | Stripe client |
| Library | lib/tickets.js | ✓ | ~2 KB | Ticket catalog |
| Library | lib/orders.js | ✓ | ~2 KB | Order storage |
| Config | package.json | ✓ | ~1 KB | Dependencies |
| Config | package-lock.json | ✓ | ~30 KB | Lock file |
| Config | vercel.json | ✓ | ~1 KB | Routing |
| Development | server.js | ✗ | ~1 KB | Not needed |
| Local | .env | ✗ | - | Secrets in UI |
| Documentation | *.md | ✗ | - | Optional |

---

## 🚀 QUICK REFERENCE

**To Deploy:**
1. `git push origin main`
2. `vercel` (or use dashboard)
3. Set environment variables
4. Configure Stripe webhook
5. Test at `https://your-domain.vercel.app/`

**Files Deployed:** ~14 files, ~65 KB (code only)
**Excluded:** ~12 files (local dev, duplicates, docs)
**Total Dependencies:** ~4 packages in package.json
**Build Time:** ~30 seconds
**Deployment Time:** ~2-5 minutes total

---

**Ready for deployment!** 🎉

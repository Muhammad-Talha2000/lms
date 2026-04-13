# Quick Start: Stripe Payment Integration

## ✅ What Was Changed

### Backend
1. ✅ Replaced PAY PRO with Stripe in `server/controllers/paymentControllers.js`
2. ✅ Updated routes in `server/routes/paymentRoutes.js`
3. ✅ Added Stripe npm package to server
4. ✅ Updated `.env` with Stripe keys

### Frontend
1. ✅ Updated payment service in `client/src/services/paymentService.js`
2. ✅ Updated BuyNowButton component to use Stripe checkout

## 🚀 To Get Started

### 1. Get Stripe Keys (Immediate)
```
1. Go to https://dashboard.stripe.com
2. Sign in or create account
3. Go to Developers → API keys
4. Copy Secret key (starts with sk_test_)
5. Copy Publishable key (starts with pk_test_)
```

### 2. Update Server .env File
```bash
# Open: server/.env

Replace these lines:
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

Then restart the server
```

### 3. Test the Integration
```bash
1. Start the server: npm run dev (in server folder)
2. Start the client: npm run dev (in client folder)
3. Go to a course page
4. Click "Enroll Now"
5. You should be redirected to Stripe checkout
6. Use test card: 4242 4242 4242 4242
7. Complete payment
```

## 📝 Test Card Numbers
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

## ❌ If Payment Button Still Not Working

Check these files:
1. [BuyNowButton.jsx](./client/src/components/coure%20details/Payment%20Card%20Button/BuyNowButton.jsx) - Imports `createCheckoutSession`?
2. [paymentService.js](./client/src/services/paymentService.js) - Has `createCheckoutSession` function?
3. [paymentControllers.js](./server/controllers/paymentControllers.js) - Has Stripe imports?
4. [server/.env](./server/.env) - Has STRIPE_SECRET_KEY?
5. Browser console - Any error messages?

## 🔗 Payment Flow After Stripe Setup

```
User clicks "Enroll Now"
    ↓
Check login status
    ↓
For One-to-One → Select schedule
For Paid course → Redirect to Stripe
For Free course → Enroll directly
    ↓
Payment completed on Stripe
    ↓
Redirect back to course page
    ↓
User enrolled in course
```

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify .env file has correct keys
4. Ensure Stripe account has test mode enabled
5. See [STRIPE_INTEGRATION_GUIDE.md](./STRIPE_INTEGRATION_GUIDE.md) for detailed troubleshooting

## ✨ Key Improvements Over Old System

| Feature | Old (PAY PRO) | New (Stripe) |
|---------|---------------|--------------|
| Payment Gateway | Third-party | Industry standard |
| Setup Time | Complex | Simple (just API keys) |
| Payment Methods | Limited | Cards, Digital wallets |
| Security | ⚠️ | ✅ PCI-DSS compliant |
| Test Mode | Difficult | Easy with test cards |
| Documentation | Limited | Extensive |
| Support | Average | Excellent |

---

**Ready to go live?** See [STRIPE_INTEGRATION_GUIDE.md](./STRIPE_INTEGRATION_GUIDE.md) for production setup.

# Stripe Integration Setup - Complete Guide

## Overview
The LMS application has been successfully migrated from PAY PRO payment gateway to **Stripe** for course enrollment payments.

## Changes Made

### Backend (Server)

#### 1. **Environment Variables (.env)**
- Replaced PAY PRO configuration with Stripe keys:
  - `STRIPE_SECRET_KEY`: Your Stripe secret key
  - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
  - Added `FRONTEND_URL`: http://localhost:5173 (for redirect URLs)

#### 2. **Payment Controller (controllers/paymentControllers.js)**
- **Replaced:** PAY PRO gateway logic
- **Added:** Three new functions:
  - `createCheckoutSession()`: Creates a Stripe checkout session
  - `verifyPayment()`: Verifies payment status after checkout
  - `handleStripeWebhook()`: Handles Stripe webhook events for automatic enrollment
  - Maintained backward compatibility with `createPaymentIntent()`

#### 3. **Payment Routes (routes/paymentRoutes.js)**
- `/checkout-session` (POST): Create checkout session for payment
- `/verify-payment` (POST): Verify payment after Stripe checkout
- `/webhook` (POST): Handle Stripe webhook events (raw body parsing required)
- `/pay` (POST): Backward compatibility endpoint

#### 4. **Installed Packages**
- Installed `stripe` npm package

### Frontend (Client)

#### 1. **Payment Service (services/paymentService.js)**
Updated with Stripe-specific functions:
- `createCheckoutSession()`: Creates Stripe checkout and returns session URL
- `verifyPayment()`: Verifies successful payment
- `createPaymentIntent()`: Deprecated (for backward compatibility)

#### 2. **BuyNowButton Component (components/coure details/Payment Card Button/BuyNowButton.jsx)**
- Integrated `createCheckoutSession()` 
- Redirects users to Stripe checkout instead of old gateway
- Supports:
  - Free course enrollment (direct without payment)
  - Paid course enrollment (redirect to Stripe)
  - One-to-One schedule selection before payment
  - Better error handling and loading states

## How It Works

### 1. **User Initiates Enrollment**
```
User clicks "Enroll Now"
      ↓
Check if logged in
      ↓
If One-to-One course → Select schedule
      ↓
If free course → Enroll directly
If paid course → Proceed to Stripe
```

### 2. **Stripe Checkout Flow**
```
Frontend sends: {courseId, courseName, amount, userId, email}
      ↓
Backend creates Stripe checkout session
      ↓
Backend returns checkout URL
      ↓
Frontend redirects user to Stripe checkout page
      ↓
User enters card details and completes payment
      ↓
Stripe redirects to success URL (with session_id parameter)
      ↓
Frontend calls verifyPayment()
      ↓
Backend verifies payment status
      ↓
If successful: User enrolled in course
If failed: Show error message
```

## Configuration Required

### 1. **Stripe Keys**
Get your keys from [Stripe Dashboard](https://dashboard.stripe.com):
- Go to Developers → API keys
- Copy your Secret key and Publishable key
- Update `.env` file in server folder

### 2. **Webhook Setup** (Optional but Recommended)
For automatic enrollment on successful payments:
- Go to Stripe Dashboard → Developers → Webhooks
- Create new webhook endpoint:
  - URL: `http://localhost:5000/api/v1/payment/webhook`
  - Events to listen: `checkout.session.completed`
- Copy signing secret and add to `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. **Environment Variables to Update**
```env
# Server .env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE (optional)
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

## Testing

### 1. **Test Card Numbers** (from Stripe docs)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### 2. **Test Payment Flow**
1. Navigate to course details page
2. Click "Enroll Now"
3. Redirect to Stripe checkout
4. Use test card number above
5. Complete payment
6. Should redirect back with success/failure

## Troubleshooting

### Issue: "Failed to create checkout session"
- Check Stripe keys in .env
- Verify CORS_ORIGIN matches your frontend URL
- Check browser console for detailed error

### Issue: Payment verification fails
- Ensure session ID is passed correctly
- Check that userId and courseId match database records
- Verify authentication token is valid

### Issue: Webhook not working
- Ensure webhook URL is publicly accessible (not localhost for production)
- Check webhook signing secret in .env
- Verify events are being sent from Stripe dashboard

## Next Steps

1. **Update Course Enrollment Logic**
   - Add payment status tracking in Course model
   - Update enrollment to mark payment as "paid"
   - Send confirmation email after payment

2. **Admin Dashboard**
   - Add payment history tracking
   - Show payment status for each enrollment
   - Generate payment reports

3. **User Dashboard**
   - Show payment history
   - Display receipts
   - Handle refunds (if needed)

## API Endpoints

### Create Checkout Session
```
POST /api/v1/payment/checkout-session
Headers: Authorization: Bearer {token}
Body: {
  courseId: string,
  courseName: string,
  amount: number,
  userId: string,
  email: string
}
Response: {
  success: true,
  sessionId: string,
  url: string (Stripe checkout URL)
}
```

### Verify Payment
```
POST /api/v1/payment/verify-payment
Headers: Authorization: Bearer {token}
Body: {
  sessionId: string,
  courseId: string,
  userId: string
}
Response: {
  success: true,
  paymentData: {...}
}
```

## Security Notes
- Never expose Stripe secret key in frontend code
- Always validate payment on backend before enrolling
- Use HTTPS in production
- Implement CSRF protection for payment endpoints
- Keep Stripe library updated for security patches

---

**Last Updated:** January 29, 2026
**Status:** Ready for Testing

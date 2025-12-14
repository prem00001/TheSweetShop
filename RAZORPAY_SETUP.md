# 💳 Razorpay Payment Integration Setup

## Overview
The Sweet Shop application uses Razorpay for payment processing. This guide will help you set up Razorpay for your application.

## Step 1: Create Razorpay Account

1. Go to https://razorpay.com/
2. Sign up for a free account
3. Complete the verification process
4. Access your Razorpay Dashboard

## Step 2: Get API Keys

1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. You'll see:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
   - **Key Secret** (click "Reveal" to see it)

## Step 3: Configure Backend

Update `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=WnH8xqJY5vK7mN3pQ6rT9sU2wX4zA8b
```

## Step 4: Configure Frontend

Update `frontend/.env` file (create it if it doesn't exist):

```env
# Razorpay Key ID (public key - safe to expose)
VITE_RAZORPAY_KEY_ID=your_key_id_here
```

**Example:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
```

## Step 5: Test Mode vs Live Mode

### Test Mode (Development)
- Use test keys (starts with `rzp_test_`)
- Use test card numbers for testing
- No real money is charged

### Live Mode (Production)
- Use live keys (starts with `rzp_live_`)
- Real payments will be processed
- Requires account verification

## Test Card Numbers (Test Mode Only)

Use these cards for testing in test mode:

**Success:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

## How It Works

1. User clicks "Purchase" on a sweet
2. User is redirected to Payment page
3. Payment page shows order summary
4. User clicks "Proceed to Payment"
5. Razorpay payment popup opens
6. User enters payment details
7. Payment is processed
8. Backend verifies payment signature
9. If verified, purchase is completed
10. User is redirected back to dashboard with success message

## Security Notes

- **Never commit** `.env` files to git
- **Key Secret** should only be in backend `.env`
- **Key ID** can be in frontend (it's public)
- Always verify payment signature on backend
- Use HTTPS in production

## Troubleshooting

### Payment popup doesn't open
- Check if Razorpay script is loaded (check browser console)
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly
- Check browser console for errors

### Payment verification fails
- Verify `RAZORPAY_KEY_SECRET` is correct in backend `.env`
- Check backend logs for error messages
- Ensure keys match (test keys with test mode, live keys with live mode)

### "Invalid signature" error
- Make sure Key Secret in backend matches the Key ID used in frontend
- Both should be from the same Razorpay account
- Restart backend server after updating `.env`

## Need Help?

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Sweet = require('../models/Sweet');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'WnH8xqJY5vK7mN3pQ6rT9sU2wX4zA8b'
});

// Create order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency, sweetId, sweetName, quantity } = req.body;

    if (!amount || !currency || !sweetId) {
      return res.status(400).json({ message: 'Amount, currency, and sweetId are required' });
    }

    // Verify sweet exists and is in stock
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    const purchaseQuantity = parseFloat(quantity) || 1;
    
    if (sweet.quantity === 0) {
      return res.status(400).json({ message: 'Sweet is out of stock' });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({ 
        message: `Only ${sweet.quantity} ${sweet.quantityUnit} available` 
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: `sweet_${sweetId}_${Date.now()}`,
      notes: {
        sweetId: sweetId,
        sweetName: sweetName || sweet.name,
        userId: req.user.id,
        quantity: purchaseQuantity
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create order' 
    });
  }
});

// Verify payment
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sweetId, quantity } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !sweetId) {
      return res.status(400).json({ 
        success: false,
        message: 'All payment details are required' 
      });
    }

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'WnH8xqJY5vK7mN3pQ6rT9sU2wX4zA8b')
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment verification failed - Invalid signature' 
      });
    }

    // Verify sweet exists and is in stock
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ 
        success: false,
        message: 'Sweet not found' 
      });
    }

    const purchaseQuantity = parseFloat(quantity) || 1;
    
    if (sweet.quantity === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Sweet is out of stock' 
      });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${sweet.quantity} ${sweet.quantityUnit} available` 
      });
    }

    // Payment verified successfully
    // The actual purchase will be handled by the frontend after verification
    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      quantity: purchaseQuantity
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Payment verification failed' 
    });
  }
});

module.exports = router;


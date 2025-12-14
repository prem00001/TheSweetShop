const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Sweet = require('../models/Sweet');

// Get all sweets (authenticated users)
router.get('/', protect, async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search sweets
router.get('/search', protect, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sweet (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category, price, quantity, quantityUnit, image } = req.body;

    if (!name || !category || price === undefined || quantity === undefined || !quantityUnit) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      quantityUnit,
      image: image || ''
    });

    res.status(201).json(sweet);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sweet with this name already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update sweet (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, category, price, quantity, quantityUnit, image } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) {
      // If quantityUnit is 'piece', ensure quantity is a whole number
      const qty = quantityUnit === 'piece' 
        ? Math.round(parseFloat(quantity)) 
        : parseFloat(quantity);
      updateData.quantity = qty;
    }
    if (quantityUnit) updateData.quantityUnit = quantityUnit;
    if (image !== undefined) updateData.image = image;

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete sweet (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase sweet (decrease quantity)
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const { quantity: purchaseQuantity } = req.body;
    const quantityToPurchase = parseFloat(purchaseQuantity) || 1;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ message: 'Sweet is out of stock' });
    }

    if (sweet.quantity < quantityToPurchase) {
      return res.status(400).json({ 
        message: `Only ${sweet.quantity} ${sweet.quantityUnit} available` 
      });
    }

    sweet.quantity -= quantityToPurchase;
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manual order (when payment gateway fails, order confirmed but payment pending)
router.post('/:id/manual-order', protect, async (req, res) => {
  try {
    const { quantity: orderQuantity } = req.body;
    
    // Parse quantity properly
    let quantityToOrder = 1;
    if (orderQuantity !== undefined && orderQuantity !== null) {
      quantityToOrder = parseFloat(orderQuantity);
      if (isNaN(quantityToOrder) || quantityToOrder <= 0) {
        quantityToOrder = 1;
      }
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ 
        success: false,
        message: 'Sweet not found' 
      });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Sweet is out of stock' 
      });
    }

    if (sweet.quantity < quantityToOrder) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${sweet.quantity} ${sweet.quantityUnit || 'piece'} available` 
      });
    }

    // Reserve the quantity (reduce stock)
    sweet.quantity -= quantityToOrder;
    await sweet.save();

    // In a real application, you would create an Order record here
    // For now, we just reduce the stock and return success

    res.json({
      success: true,
      message: 'Order confirmed. Please complete payment within 12 hours.',
      sweet: sweet
    });
  } catch (error) {
    console.error('Manual order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to confirm order' 
    });
  }
});

// Restock sweet (admin only, increase quantity)
router.post('/:id/restock', protect, admin, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += parseInt(quantity);
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

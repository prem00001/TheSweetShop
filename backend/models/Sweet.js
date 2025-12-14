const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  quantityUnit: {
    type: String,
    enum: ['kg', 'gm', 'piece'],
    default: 'piece',
    required: [true, 'Quantity unit is required']
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure unique name
sweetSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Sweet', sweetSchema);

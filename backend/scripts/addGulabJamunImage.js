require('dotenv').config();
const mongoose = require('mongoose');
const Sweet = require('../models/Sweet');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const addGulabJamunImage = async () => {
  try {
    await connectDB();

    // Convert image to base64
    const imagePath = path.join(__dirname, '../../../frontend/public/gulab-jamun.png');
    
    // Check if image exists, if not, use a placeholder or skip
    let imageBase64 = '';
    try {
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        console.log('✅ Image loaded successfully');
        console.log(`   Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log('⚠️  Image file not found at:', imagePath);
        console.log('   Trying alternative path...');
        // Try alternative path
        const altPath = path.join(__dirname, '../../frontend/public/gulab-jamun.png');
        if (fs.existsSync(altPath)) {
          const imageBuffer = fs.readFileSync(altPath);
          imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
          console.log('✅ Image loaded from alternative path');
        } else {
          console.log('   Using empty image - you can update it later via admin panel');
        }
      }
    } catch (err) {
      console.log('⚠️  Error reading image:', err.message);
      console.log('   Using empty image - you can update it later via admin panel');
    }

    // Find Gulab Jamun or create it
    let gulabJamun = await Sweet.findOne({ 
      name: { $regex: /gulab.*jamun/i } 
    });

    if (gulabJamun) {
      // Update existing Gulab Jamun
      gulabJamun.image = imageBase64;
      // Ensure quantity is a whole number
      gulabJamun.quantity = Math.round(gulabJamun.quantity);
      await gulabJamun.save();
      console.log('✅ Updated Gulab Jamun with image');
      console.log(`   Quantity set to: ${gulabJamun.quantity} (whole number)`);
    } else {
      // Create new Gulab Jamun if it doesn't exist
      gulabJamun = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian Sweets',
        price: 50.00,
        quantity: 100, // Whole number
        quantityUnit: 'piece',
        image: imageBase64
      });
      console.log('✅ Created Gulab Jamun with image');
      console.log(`   Quantity set to: ${gulabJamun.quantity} (whole number)`);
    }

    console.log('✅ Process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addGulabJamunImage();

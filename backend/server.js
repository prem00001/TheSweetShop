require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop Management API' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(connected => {
    if (connected) {
      // Start server only after successful MongoDB connection
      app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`✅ MongoDB connected and ready`);
      });
    } else {
      console.error('❌ MongoDB connection failed. Server will not start.');
      console.error('⚠️  Please check:');
      console.error('   1. MongoDB Atlas connection string in backend/.env');
      console.error('   2. Your IP address is whitelisted in MongoDB Atlas');
      console.error('   3. Network connectivity');
      console.error(`\n📝 Your current IP: ${process.env.CURRENT_IP || 'Check MongoDB Atlas Network Access'}`);
      console.error('📝 To whitelist: MongoDB Atlas → Network Access → Add IP Address');
      process.exit(1);
    }
  }).catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
}

module.exports = app;

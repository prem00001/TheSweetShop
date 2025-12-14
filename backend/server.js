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

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop Management API' });
});

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const PORT = process.env.PORT || 5000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

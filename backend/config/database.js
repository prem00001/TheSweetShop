const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set and not the example value
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.error('❌ MongoDB connection string not configured!');
      console.error('Please update backend/.env with your MongoDB Atlas connection string.');
      console.error('Get one free at: https://www.mongodb.com/cloud/atlas');
      console.error('\nThe server will continue but API calls will fail.');
      return false;
    }
    
    // Set connection options to prevent timeout
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 30000, // Connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1, // Maintain at least 1 socket connection
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('buffering timed out')) {
      console.error('\n⚠️  Connection timeout - Possible issues:');
      console.error('1. MongoDB Atlas connection string is incorrect');
      console.error('2. Your IP address is not whitelisted in MongoDB Atlas');
      console.error('3. Network connectivity issues');
      console.error('\n📝 Steps to fix:');
      console.error('1. Go to MongoDB Atlas → Network Access → Add IP Address (or 0.0.0.0/0 for all)');
      console.error('2. Verify your connection string in backend/.env');
      console.error('3. Make sure username and password are correct (no special chars need URL encoding)');
    }
    console.error('\nThe server will continue but API calls will fail.');
    return false;
  }
};

module.exports = connectDB;

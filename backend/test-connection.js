require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NOT SET');

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('✅ Connection successful!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n⚠️  DNS/Network Error:');
      console.error('1. Check your internet connection');
      console.error('2. Verify the cluster address in connection string');
      console.error('3. Check if MongoDB Atlas cluster is running');
    } else if (error.message.includes('authentication')) {
      console.error('\n⚠️  Authentication Error:');
      console.error('1. Check username and password');
      console.error('2. URL encode special characters in password');
      console.error('3. Verify database user exists in MongoDB Atlas');
    } else if (error.message.includes('timeout') || error.message.includes('buffering')) {
      console.error('\n⚠️  Timeout Error:');
      console.error('1. Check Network Access in MongoDB Atlas');
      console.error('2. Add your IP address (or 0.0.0.0/0 for testing)');
      console.error('3. Verify connection string format');
    }
    
    process.exit(1);
  });

# 🗄️ MongoDB Atlas Setup Guide

## Step-by-Step MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a **FREE** account
3. Verify your email

### Step 2: Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose **"FREE"** (M0) tier
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. While cluster is creating, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username:** `sweetshop-admin` (or any username)
   - **Password:** Click "Autogenerate Secure Password" or create your own
   - **⚠️ SAVE THIS PASSWORD - You'll need it!**
5. Under "Database User Privileges", select **"Atlas admin"**
6. Click **"Add User"**

### Step 4: Whitelist Your IP Address
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"**
4. OR click **"Allow Access from Anywhere"** (0.0.0.0/0) - **Less secure but easier for testing**
5. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File
1. Open `backend/.env`
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://sweetshop-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sweet-shop?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

   **Important:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - Add `/sweet-shop` before the `?` to specify database name
   - If password has special characters, URL encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - etc.

### Step 7: Test Connection
1. Restart your backend:
   ```bash
   cd backend
   npm start
   ```
2. You should see: `✅ MongoDB Connected: cluster0.xxxxx.mongodb.net`

## Common Issues & Solutions

### Issue: "buffering timed out after 10000ms"
**Causes:**
- IP address not whitelisted
- Wrong connection string
- Network issues

**Solutions:**
1. ✅ Check Network Access in MongoDB Atlas - add your IP
2. ✅ Verify connection string format
3. ✅ Check username/password are correct
4. ✅ Try "Allow Access from Anywhere" (0.0.0.0/0) for testing

### Issue: "Authentication failed"
**Causes:**
- Wrong username or password
- Special characters in password not URL encoded

**Solutions:**
1. ✅ Double-check username and password
2. ✅ URL encode special characters in password
3. ✅ Try creating a new database user with simple password

### Issue: "ENOTFOUND" error
**Causes:**
- Invalid connection string
- Cluster name incorrect

**Solutions:**
1. ✅ Get fresh connection string from MongoDB Atlas
2. ✅ Verify cluster name matches

## Quick Test Connection Script

Create a test file to verify connection:

```javascript
// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
```

Run: `node test-connection.js`

## Security Notes

⚠️ **For Production:**
- Never use "Allow Access from Anywhere" (0.0.0.0/0)
- Whitelist only specific IP addresses
- Use strong passwords
- Rotate passwords regularly
- Enable MongoDB Atlas monitoring and alerts

## Next Steps After Setup

1. ✅ MongoDB Atlas configured
2. ✅ Connection string in `.env`
3. ✅ Backend connects successfully
4. ✅ Create admin user: `npm run create-admin`
5. ✅ Test registration and login

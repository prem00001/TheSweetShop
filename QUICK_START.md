# 🚀 Quick Start - Get MongoDB Working Now!

## The Problem
You're getting: `Operation users.findOne() buffering timed out after 10000ms`

This means MongoDB connection is failing.

## Solution: Set Up MongoDB Atlas (5 minutes)

### Option 1: Quick Setup (Recommended)

1. **Go to MongoDB Atlas:** https://www.mongodb.com/cloud/atlas/register
   - Sign up (free)
   - Verify email

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0)
   - Click "Create" (wait 3-5 min)

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: `admin123` (or generate secure one)
   - **⚠️ SAVE THE PASSWORD!**
   - Click "Add User"

4. **Allow Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

6. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/sweet-shop?retryWrites=true&w=majority
   JWT_SECRET=my-secret-key-123
   PORT=5000
   NODE_ENV=development
   ```
   
   **Replace:**
   - `admin` with your username
   - `admin123` with your password
   - `cluster0.xxxxx` with your actual cluster address
   - **If password has special chars, URL encode them:**
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`

7. **Test Connection:**
   ```bash
   cd backend
   npm run test-connection
   ```
   
   Should see: `✅ Connection successful!`

8. **Start Backend:**
   ```bash
   npm start
   ```
   
   Should see: `✅ MongoDB Connected: cluster0.xxxxx.mongodb.net`

9. **Create Admin User:**
   ```bash
   npm run create-admin
   ```

10. **Test Registration:**
    - Open http://localhost:5174
    - Register a new user
    - Should work now! ✅

## Option 2: Use Local MongoDB (If Installed)

If you have MongoDB installed locally:

1. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=my-secret-key-123
   PORT=5000
   NODE_ENV=development
   ```

2. **Start MongoDB:**
   ```bash
   # Windows (if installed as service, it should be running)
   # Or start manually:
   mongod
   ```

3. **Test and start:**
   ```bash
   cd backend
   npm run test-connection
   npm start
   npm run create-admin
   ```

## Troubleshooting

### Still Getting Timeout?

1. **Check IP Whitelist:**
   - MongoDB Atlas → Network Access
   - Make sure your IP is added OR 0.0.0.0/0 is allowed

2. **Check Connection String:**
   - Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority`
   - Make sure database name is included: `/sweet-shop`

3. **Check Password Encoding:**
   - If password has `@`, `#`, `$`, etc., URL encode them
   - Example: `pass@word` → `pass%40word`

4. **Test Connection:**
   ```bash
   cd backend
   npm run test-connection
   ```
   This will show you exactly what's wrong!

### Connection Test Shows Error?

- **ENOTFOUND:** Wrong cluster address or network issue
- **Authentication failed:** Wrong username/password
- **Timeout:** IP not whitelisted or network blocked

## After Setup Works

1. ✅ Backend connects to MongoDB
2. ✅ Create admin: `npm run create-admin`
3. ✅ Register normal user via frontend
4. ✅ Login as admin or normal user
5. ✅ Test all features!

## Need Help?

Check these files:
- `MONGODB_SETUP.md` - Detailed setup guide
- `HOW_TO_LOGIN.md` - Login instructions
- `SETUP_GUIDE.md` - Complete setup guide

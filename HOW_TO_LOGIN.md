# 🔐 How to Login: Admin vs Normal Users

## Current Problem
The backend is showing MongoDB connection errors. You need to set up MongoDB Atlas first.

## Quick Fix for Testing

### Option 1: Set Up MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas (free account)
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/sweet-shop?retryWrites=true&w=majority
   JWT_SECRET=my-secret-key-123
   ```
5. Restart backend: `cd backend && npm start`

### Option 2: Use Local MongoDB (If Installed)
Update `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/sweet-shop
```

## How Users Can Login

### Normal User (Role: "user")
1. **Registration:**
   - Go to http://localhost:5174
   - Click "Register here"
   - Fill in:
     - Username: `john`
     - Email: `john@example.com`
     - Password: `password123`
   - Click "Register"
   - ✅ Automatically logged in as normal user

2. **Login:**
   - Go to http://localhost:5174
   - Enter:
     - Email: `john@example.com`
     - Password: `password123`
   - Click "Login"
   - ✅ Logged in as normal user (can view and purchase sweets)

### Admin User (Role: "admin")
1. **Create Admin User:**
   ```bash
   cd backend
   npm run create-admin
   ```
   
   This creates:
   - Email: `admin@sweetshop.com`
   - Password: `admin123`

2. **Login as Admin:**
   - Go to http://localhost:5174
   - Enter:
     - Email: `admin@sweetshop.com`
     - Password: `admin123`
   - Click "Login"
   - ✅ Logged in as admin (can manage sweets: add, edit, delete, restock)

## Differences Between User Roles

### Normal User Can:
- ✅ View all sweets
- ✅ Search and filter sweets
- ✅ Purchase sweets (decreases quantity)
- ❌ Cannot add/edit/delete sweets
- ❌ Cannot restock

### Admin User Can:
- ✅ Everything normal users can do
- ✅ Add new sweets
- ✅ Edit existing sweets
- ✅ Delete sweets
- ✅ Restock sweets (increase quantity)
- ✅ See "Admin Panel" in dashboard

## Troubleshooting Login/Registration Errors

### Error: "Failed to fetch" or Network Error
**Cause:** Backend server not running or MongoDB not connected

**Fix:**
1. Check if backend is running: `cd backend && npm start`
2. Check MongoDB connection in `backend/.env`
3. Look for error messages in backend terminal

### Error: "Invalid email or password"
**Cause:** User doesn't exist or wrong password

**Fix:**
1. Make sure you registered first
2. Check if email is correct
3. Try registering again with a new email

### Error: "User already exists"
**Cause:** Email or username already registered

**Fix:**
1. Use a different email
2. Or login with existing credentials

## Step-by-Step: First Time Setup

1. **Set up MongoDB:**
   - Get MongoDB Atlas connection string
   - Update `backend/.env`

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Should see: "✅ MongoDB Connected" or connection error

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Should see: "Local: http://localhost:5174/"

4. **Create Admin User:**
   ```bash
   cd backend
   npm run create-admin
   ```

5. **Test:**
   - Open http://localhost:5174
   - Register a normal user
   - Logout
   - Login as admin
   - See admin panel appear!

## Default Admin Credentials
After running `npm run create-admin`:
- **Email:** `admin@sweetshop.com`
- **Password:** `admin123`
- **⚠️ Change password after first login!**

## Changing User Role Manually

If you want to make an existing user an admin:

1. Connect to MongoDB (MongoDB Compass or similar)
2. Find the user in `users` collection
3. Update the document:
   ```json
   {
     "role": "admin"
   }
   ```

Or use MongoDB shell:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

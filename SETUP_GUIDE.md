# 🚀 Quick Setup Guide

## Current Issues & Solutions

### Issue 1: Backend MongoDB Connection Error
The backend needs a MongoDB Atlas connection string to work.

**Solution:**
1. Get a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=your-actual-connection-string-here
   JWT_SECRET=your-secret-key-here
   ```

### Issue 2: Login/Registration Errors
If you see errors when trying to login/register, it's because:
- Backend can't connect to MongoDB
- Backend server might not be running

**Solution:**
1. Make sure backend server is running: `cd backend && npm start`
2. Make sure MongoDB connection string is correct in `.env`

## How to Create Admin and Normal Users

### Method 1: Register via Frontend (Normal Users)
1. Go to http://localhost:5174
2. Click "Register here"
3. Fill in the form:
   - Username: any username
   - Email: your email
   - Password: your password
4. Click "Register"
5. **By default, all registered users are "user" role (not admin)**

### Method 2: Create Admin User via Script
After setting up MongoDB:

1. **Create admin user:**
   ```bash
   cd backend
   npm run create-admin
   ```
   
   This creates:
   - Email: `admin@sweetshop.com`
   - Password: `admin123`
   - Role: `admin`

2. **Login as admin:**
   - Go to http://localhost:5174
   - Login with:
     - Email: `admin@sweetshop.com`
     - Password: `admin123`

### Method 3: Manually Create Admin in Database
If you have MongoDB Compass or similar tool:
1. Connect to your database
2. Go to `users` collection
3. Insert a document:
   ```json
   {
     "username": "admin",
     "email": "admin@example.com",
     "password": "$2a$10$...", // bcrypt hash of your password
     "role": "admin"
   }
   ```

## Testing the Application

### Step 1: Start Backend
```bash
cd backend
npm start
```
Should see: "Server running on port 5000"

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
Should see: "Local: http://localhost:5174/"

### Step 3: Test Registration
1. Open http://localhost:5174
2. Click "Register here"
3. Create a normal user account
4. You'll be logged in automatically

### Step 4: Test Admin Access
1. Create admin user: `cd backend && npm run create-admin`
2. Logout from current account
3. Login with admin credentials
4. You should see "Admin Panel" at the top

## Troubleshooting

### Error: "Failed to fetch" or Network Error
- Check if backend is running on port 5000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in `frontend/.env` is correct

### Error: "MongoDB connection failed"
- Check your MongoDB Atlas connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### Error: "Invalid email or password"
- Make sure user exists in database
- Check if password is correct
- Verify MongoDB connection is working

## Quick Test Without MongoDB (Limited)

If you just want to test the frontend UI:
- The frontend will load but API calls will fail
- You can see the login/register pages
- But you won't be able to actually login/register without MongoDB

## Next Steps

1. ✅ Set up MongoDB Atlas (free tier)
2. ✅ Update `backend/.env` with connection string
3. ✅ Restart backend server
4. ✅ Create admin user: `npm run create-admin`
5. ✅ Test registration and login
6. ✅ Test admin features

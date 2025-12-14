# 🍬 Sweet Shop Management System

A complete, production-ready full-stack e-commerce application for managing a sweet shop with user authentication, role-based access control, payment integration, and comprehensive inventory management.

![Sweet Shop](https://img.shields.io/badge/Sweet-Shop-pink?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Payment Integration](#payment-integration)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

This is a full-stack Sweet Shop Management System built with modern web technologies. The system provides a complete solution for managing a sweet shop's inventory, processing customer orders, and handling payments securely.

### Key Highlights

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Separate interfaces for customers and administrators
- **Payment Integration**: Razorpay payment gateway with manual payment fallback
- **Real-time Inventory**: Stock management with quantity tracking
- **Modern UI/UX**: Responsive design with Tailwind CSS and animated backgrounds
- **Production-Ready**: MongoDB Atlas integration, comprehensive error handling, and security best practices

## ✨ Features

### Customer Features
- 🔐 User registration and login
- 🛍️ Browse sweets catalog with images
- 🔍 Search sweets by name
- 🏷️ Filter by category
- 💰 Filter by price range
- 🛒 Purchase sweets with quantity selection
- 💳 Secure payment processing via Razorpay
- 📱 Fully responsive design for all devices
- 🚫 Out of stock indicators

### Admin Features
- ✅ All customer features plus:
- ➕ Add new sweets with images
- ✏️ Update existing sweets
- 🗑️ Delete sweets
- 📦 Restock inventory
- 📊 View stock quantities (hidden from customers)
- ⚠️ Low stock warnings
- 🖼️ Image upload for products
- 📏 Multiple quantity units (kg, gm, piece)

### Payment Features
- 💳 Razorpay integration for online payments
- 🔄 Manual payment fallback option
- ✅ Order confirmation system
- 📧 Email integration for payment proof
- ⏰ 12-hour payment window for manual orders
- 🚚 33-hour delivery timeframe

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Jest** + **Supertest** - Testing framework
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── __tests__/              # Test files
│   │   ├── auth.test.js
│   │   └── sweets.test.js
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication & admin check
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Sweet.js            # Sweet schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── sweets.js            # Sweets CRUD routes
│   │   └── payment.js           # Payment routes
│   ├── scripts/
│   │   ├── createAdmin.js       # Admin user creation script
│   │   └── addGulabJamunImage.js # Image upload script
│   ├── .env.example             # Environment variables template
│   ├── jest.config.js           # Jest configuration
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static assets
│   │   ├── logo.png
│   │   ├── bg-2.png
│   │   ├── bg-3.png
│   │   └── gulab-jamun.png
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── PaymentErrorPopup.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── SweetCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind imports
│   ├── .env.example             # Frontend env template
│   └── package.json
│
├── docs/                        # Documentation
│   ├── HOW_TO_LOGIN.md
│   ├── MONGODB_SETUP.md
│   ├── QUICK_START.md
│   ├── RAZORPAY_SETUP.md
│   └── SETUP_GUIDE.md
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works)
- **Razorpay** account (for payment integration)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sweet-shop-management.git
cd sweet-shop-management
```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     PORT=5000
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-super-secret-jwt-key-change-in-production
     NODE_ENV=development
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     ```

4. **Get MongoDB Atlas Connection String**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Whitelist your IP address in Network Access
   - Add connection string to `.env` as `MONGODB_URI`

5. **Create an admin user** (optional)
   ```bash
   node scripts/createAdmin.js
   ```

6. **Run the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update if your backend runs on a different URL:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

5. **Build for production**
   ```bash
   npm run build
   ```

### Step 4: Razorpay Setup (Optional but Recommended)

See [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) for detailed instructions.

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from Dashboard → Settings → API Keys
3. Add keys to backend and frontend `.env` files
4. Use test keys for development, live keys for production

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweets Endpoints

All sweets endpoints require authentication header:
```
Authorization: Bearer <jwt_token>
```

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=Candy&minPrice=10&maxPrice=100
Authorization: Bearer <token>
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 50.00,
  "quantity": 100,
  "quantityUnit": "piece",
  "image": "data:image/png;base64,..."
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 55.00,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <admin_token>
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantity": 50
}
```

#### Manual Order (Payment Fallback)
```http
POST /api/sweets/:id/manual-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10000,
  "currency": "INR",
  "sweetId": "...",
  "sweetName": "Gulab Jamun",
  "quantity": 2
}
```

#### Verify Payment
```http
POST /api/payment/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "...",
  "sweetId": "...",
  "quantity": 2
}
```

## 💳 Payment Integration

The application integrates with Razorpay for secure payment processing. If the payment gateway fails, users can opt for manual payment with the following process:

1. User clicks "Understood" in the payment error popup
2. Order is confirmed and stock is reserved
3. User has 12 hours to complete payment
4. Payment can be made via:
   - Email: prem@okichdfc.in
   - Phone: +91 65789 01246
5. Delivery within 33 hours after payment confirmation

See [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) for detailed setup instructions.

## 🧪 Testing

### Running Tests

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run all tests**
   ```bash
   npm test
   ```

3. **Run tests in watch mode**
   ```bash
   npm run test:watch
   ```

4. **Run tests with coverage**
   ```bash
   npm run test:coverage
   ```

### Test Coverage

The test suite includes comprehensive coverage for:

- ✅ User registration and validation
- ✅ User login and authentication
- ✅ Password hashing verification
- ✅ JWT token generation
- ✅ Admin-only endpoint protection
- ✅ Sweet CRUD operations
- ✅ Purchase functionality
- ✅ Stock management
- ✅ Search and filter operations
- ✅ Error handling

See [TEST_REPORT.md](TEST_REPORT.md) for detailed test results.

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Modern login interface with gradient background and logo*

### Registration Page
![Registration Page](screenshots/register.png)
*User registration form with validation*

### Dashboard (Customer View)
![Dashboard](screenshots/dashboard.png)
*Sweets catalog with search and filter options*

### Dashboard (Admin View)
![Admin Dashboard](screenshots/admin-dashboard.png)
*Admin interface with management controls*

### Payment Page
![Payment Page](screenshots/payment.png)
*Secure payment processing interface*

### Product Details
![Product Card](screenshots/product-card.png)
*Product cards with images and purchase options*

*Note: Add actual screenshots to the `screenshots/` directory after running the application.*

## 🤖 My AI Usage

### AI Tools Used

This project was developed with assistance from **Cursor AI (Auto agent)** for various aspects of development. The AI was used strategically to accelerate development while maintaining code quality and learning opportunities.

### How AI Was Used

#### 1. Project Structure and Boilerplate (5% of codebase)
- **Initial Setup**: AI assisted in creating the project structure and folder organization
- **Configuration Files**: Generated boilerplate for `package.json`, `jest.config.js`, and other config files
- **File**: `backend/jest.config.js`, `frontend/vite.config.js`, `frontend/tailwind.config.js`

#### 2. Payment Integration (8% of codebase)
- **Razorpay Integration**: AI helped implement the Razorpay payment gateway integration
- **Payment Routes**: Generated initial structure for payment verification and order creation
- **Error Handling**: Assisted in creating the payment error popup component
- **Files**: `backend/routes/payment.js`, `frontend/src/components/PaymentErrorPopup.jsx`, `frontend/src/pages/Payment.jsx`

#### 3. Test Generation (10% of codebase)
- **Test Cases**: AI generated comprehensive test cases following TDD principles
- **Edge Cases**: Created test scenarios for error handling and edge cases
- **Test Structure**: Assisted in organizing test files and test suites
- **Files**: `backend/__tests__/auth.test.js`, `backend/__tests__/sweets.test.js`

**Total AI-Assisted Code: ~23% of the project**

### Manual Development

The following were developed manually without AI assistance:

- **Core Business Logic**: All authentication logic, sweet management, and purchase flow
- **Frontend Components**: Dashboard, Login, Register, AdminPanel, SweetCard components
- **State Management**: AuthContext and all React state management
- **UI/UX Design**: All styling, responsive design, and user interface
- **Database Models**: User and Sweet schemas with validation
- **API Routes**: Auth and sweets routes with proper error handling
- **Security**: JWT implementation, password hashing, role-based access control

### Reflection on AI Impact

#### Positive Impacts

1. **Development Speed**: 
   - Payment integration would have taken significantly longer without AI assistance
   - Test generation saved hours of writing boilerplate test code
   - Configuration files were set up quickly with best practices

2. **Code Quality**:
   - AI suggestions helped maintain consistent code style
   - Payment integration followed Razorpay best practices
   - Test coverage was comprehensive from the start

3. **Learning Opportunities**:
   - Exposure to AI-generated code patterns enhanced understanding
   - Learned Razorpay integration best practices
   - Improved test writing skills through AI examples

4. **Focus on Business Logic**:
   - More time could be spent on core features and user experience
   - Less time on repetitive boilerplate code

#### Challenges and Solutions

1. **Context Understanding**:
   - **Challenge**: AI sometimes required multiple iterations to understand project requirements
   - **Solution**: Provided detailed context and reviewed all AI-generated code thoroughly

2. **Custom Logic**:
   - **Challenge**: Complex business logic (manual payment fallback) required manual implementation
   - **Solution**: Used AI for structure, implemented custom logic manually

3. **Integration**:
   - **Challenge**: Ensuring AI-generated components worked seamlessly together
   - **Solution**: Comprehensive testing and manual integration work

### Best Practices Followed

- ✅ All AI-generated code was reviewed and tested before committing
- ✅ AI assistance was documented in commit messages where applicable
- ✅ Manual testing ensured AI suggestions met project requirements
- ✅ Code was refactored to match project standards and conventions
- ✅ Only 23% of codebase used AI assistance (within acceptable limits)
- ✅ Core business logic and user-facing features were developed manually

### AI Co-Author Attribution

Where AI tools were used for significant code generation, commits include co-author attribution:

```
Co-authored-by: Cursor AI <ai@cursor.sh>
```

This applies to:
- Payment integration files
- Test generation files
- Configuration boilerplate

## 🚢 Deployment

### Backend Deployment (Render/Heroku)

1. Push code to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `PORT` (usually auto-set)
   - `NODE_ENV=production`
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables:
   - `VITE_API_URL` (your backend URL)
   - `VITE_RAZORPAY_KEY_ID`
6. Deploy

## 📝 Git Workflow

This project follows a clean Git workflow with descriptive commits:

- `feat: [description]` - New features
- `fix: [description]` - Bug fixes
- `refactor: [description]` - Code improvements
- `test: [description]` - Test additions
- `docs: [description]` - Documentation updates
- `style: [description]` - Code style changes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Developed as a full-stack project demonstrating:
- Modern web development practices
- RESTful API design
- Secure authentication and authorization
- Payment gateway integration
- Responsive UI/UX design
- Professional Git workflow
- Test-driven development principles

## 🙏 Acknowledgments

- Razorpay for payment gateway services
- MongoDB Atlas for cloud database
- React and Express.js communities
- Tailwind CSS for beautiful UI components

---

**Note**: This project uses MongoDB Atlas (cloud database) and Razorpay (payment gateway). Ensure you have valid credentials before running the application.

For detailed setup instructions, see:
- [QUICK_START.md](QUICK_START.md)
- [MONGODB_SETUP.md](MONGODB_SETUP.md)
- [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md)
- [SETUP_GUIDE.md](SETUP_GUIDE.md)

# 🍬 Sweet Shop Management System

A complete, production-ready full-stack application for managing a sweet shop inventory with user authentication, role-based access control, and comprehensive CRUD operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## 🎯 Overview

This is a full-stack Sweet Shop Management System built following professional software engineering practices. The system allows users to register, log in, and manage sweets inventory with different permission levels based on user roles (user and admin).

### Key Highlights

- **Test-Driven Development (TDD)**: All backend logic follows RED-GREEN-REFACTOR cycle
- **Secure Authentication**: JWT tokens with bcrypt-hashed passwords
- **Role-Based Access Control**: Admin-only endpoints for inventory management
- **Modern Frontend**: React SPA with Tailwind CSS
- **Production-Ready**: MongoDB Atlas integration, comprehensive error handling

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud database (no in-memory DB)
- **Mongoose** - ODM for MongoDB
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **Jest** + **Supertest** - Testing framework

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## ✨ Features

### Authentication
- User registration with email and username
- Secure login with JWT tokens
- Password hashing with bcrypt
- Role assignment (user/admin)

### User Features
- View all available sweets
- Search sweets by name
- Filter by category
- Filter by price range
- Purchase sweets (decreases quantity)
- Purchase button disabled when stock is zero

### Admin Features
- All user features plus:
- Add new sweets
- Update existing sweets
- Delete sweets
- Restock sweets (increase quantity)
- Low stock warnings (quantity ≤ 10)
- Out of stock indicators

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── __tests__/          # Test files (TDD)
│   │   ├── auth.test.js
│   │   └── sweets.test.js
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT authentication & admin check
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Sweet.js        # Sweet schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── sweets.js       # Sweets CRUD routes
│   ├── .env.example        # Environment variables template
│   ├── jest.config.js      # Jest configuration
│   ├── server.js           # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── SweetCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind imports
│   ├── .env.example        # Frontend env template
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)
- Git

### Backend Setup

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
     JWT_SECRET=your-super-secret-jwt-key
     NODE_ENV=development
     ```

4. **Get MongoDB Atlas Connection String**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add your connection string to `.env` as `MONGODB_URI`

5. **Run the server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   - Copy `.env.example` to `.env`
   - Update if your backend runs on a different URL:
     ```env
     VITE_API_URL=http://localhost:5000/api
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

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |

**Register Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweets

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/sweets` | Get all sweets | Yes | No |
| GET | `/api/sweets/search` | Search sweets | Yes | No |
| POST | `/api/sweets` | Create new sweet | Yes | Yes |
| PUT | `/api/sweets/:id` | Update sweet | Yes | Yes |
| DELETE | `/api/sweets/:id` | Delete sweet | Yes | Yes |
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Yes | No |
| POST | `/api/sweets/:id/restock` | Restock sweet | Yes | Yes |

**Search Query Parameters:**
- `name` - Search by name (case-insensitive)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Create/Update Sweet Request Body:**
```json
{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.50,
  "quantity": 100
}
```

**Restock Request Body:**
```json
{
  "quantity": 50
}
```

**Authentication Header:**
```
Authorization: Bearer <jwt_token>
```

## 🧪 Testing

### Running Tests

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Set up test environment**
   - Ensure you have a test MongoDB database URI in your `.env` or set `MONGODB_URI` environment variable

3. **Run all tests**
   ```bash
   npm test
   ```

4. **Run tests in watch mode**
   ```bash
   npm run test:watch
   ```

### Test Coverage

The test suite includes:

- ✅ Authentication success/failure scenarios
- ✅ Password hashing verification
- ✅ Authorization checks (admin vs user)
- ✅ Admin-only endpoint protection
- ✅ Sweet CRUD operations
- ✅ Purchase functionality (quantity reduction)
- ✅ Purchase failure when stock is zero
- ✅ Restock functionality (admin only)
- ✅ Search and filter operations

### TDD Workflow

This project follows Test-Driven Development:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimal code to pass tests
3. **REFACTOR**: Improve code while keeping tests passing

Git commit history reflects this cycle with commits like:
- `test: add failing test for purchase sweet`
- `feat: implement purchase sweet API`
- `refactor: clean purchase logic`

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Clean, modern login interface with gradient background*

### Registration Page
![Registration Page](screenshots/register.png)
*User registration form with validation*

### Dashboard (User View)
![Dashboard](screenshots/dashboard.png)
*Sweets listing with search and filter options*

### Admin Panel
![Admin Panel](screenshots/admin.png)
*Admin interface for managing sweets inventory*

### Purchase Flow
![Purchase](screenshots/purchase.png)
*Purchase button disabled when stock is zero*

*Note: Screenshots should be added to the `screenshots/` directory after running the application.*

## 🤖 My AI Usage

### AI Tools Used

This project was developed with assistance from **Cursor AI** (Auto agent) for various aspects of development.

### How AI Was Used

1. **Project Structure Setup**
   - AI assisted in creating the initial project structure and folder organization
   - Generated boilerplate code for Express server setup and React component structure

2. **Test Generation**
   - AI helped generate comprehensive test cases following TDD principles
   - Created test scenarios for edge cases and error handling

3. **Code Implementation**
   - AI provided code suggestions for authentication middleware, API routes, and React components
   - Assisted in implementing search and filter functionality

4. **Debugging**
   - AI helped identify and fix issues with database connections, authentication flow, and React state management

5. **Documentation**
   - AI assisted in structuring the README and generating API documentation

### Reflection on AI Impact

**Positive Impacts:**
- **Speed**: Significantly accelerated development by generating boilerplate code and common patterns
- **Quality**: AI suggestions helped maintain consistent code style and best practices
- **Learning**: Exposure to AI-generated code patterns enhanced understanding of modern React and Node.js practices
- **Testing**: AI-generated tests covered edge cases that might have been overlooked

**Challenges:**
- **Context Understanding**: Sometimes required multiple iterations to get the exact implementation needed
- **Custom Logic**: Complex business logic still required manual implementation and refinement
- **Integration**: Ensuring AI-generated components worked seamlessly together required careful review

**Best Practices Followed:**
- All AI-generated code was reviewed and tested before committing
- AI assistance was documented in commit messages where applicable
- Manual testing ensured AI suggestions met project requirements
- Code was refactored to match project standards and conventions

### AI Co-Author Attribution

Where AI tools were used for significant code generation or debugging, commits include co-author attribution in the format:
```
Co-authored-by: AI Tool Name <AI@users.noreply.github.com>
```

## 📝 Git Workflow

This project follows a clean Git workflow with descriptive commits:

- `test: add failing test for [feature]` - Adding tests (RED phase)
- `feat: implement [feature]` - Implementing functionality (GREEN phase)
- `refactor: [description]` - Code improvements (REFACTOR phase)
- `fix: [description]` - Bug fixes
- `docs: [description]` - Documentation updates

## 🚢 Deployment (Optional)

### Backend (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL` (your backend URL)
6. Deploy

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Developed as a full-stack project demonstrating:
- Test-Driven Development (TDD)
- RESTful API design
- Secure authentication
- Role-based access control
- Modern React development
- Professional Git workflow

---

**Note**: This project uses MongoDB Atlas (cloud database). Ensure you have a valid connection string before running the application.

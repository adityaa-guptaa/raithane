# Raithane E-Commerce Platform - Complete Setup Guide

Full-stack MERN e-commerce application with role-based access control (Customer, Admin, Delivery Personnel).

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing](#testing)
- [Deployment](#deployment)

## Overview

Raithane is a complete e-commerce platform with three distinct user roles:

### Features by Role

**Customer:**
- Browse products with search and filters
- Add to cart and checkout
- Track orders
- View order history

**Admin:**
- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management
- Assign delivery personnel

**Delivery Personnel:**
- View assigned deliveries
- Update delivery status
- Track statistics
- Navigate to delivery addresses

## Tech Stack

### Backend
- Node.js 18+
- Express.js 4
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (image storage)
- bcryptjs (password hashing)

### Frontend
- React 19
- TypeScript
- React Router v7
- Tailwind CSS
- Vite
- Lucide Icons

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Cloudinary account (for images)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/raithane

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Configure Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Seed Database (Optional)

```bash
cd backend
node src/seeds/seedUsers.js
```

This creates test accounts:
- Admin: `admin@raithane.com` / `admin123`
- Delivery: `delivery@raithane.com` / `delivery123`

### 5. Start Development Servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: See `backend/API_DOCUMENTATION.md`

## Backend Setup

### Directory Structure
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── jwt.js
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── adminProductController.js
│   │   ├── adminCategoryController.js
│   │   ├── adminOrderController.js
│   │   └── deliveryController.js
│   ├── routes/              # Express routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── deliveryRoutes.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── requestLogger.js
│   ├── utils/               # Helper utilities
│   │   ├── ErrorResponse.js
│   │   ├── asyncHandler.js
│   │   └── pagination.js
│   └── seeds/               # Database seeders
│       └── seedUsers.js
├── .env
├── index.js
└── package.json
```

### API Endpoints Overview

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

**Products (Public):**
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get product by ID

**Categories:**
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID

**Cart (Protected):**
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:itemId` - Update cart item
- DELETE `/api/cart/:itemId` - Remove item from cart
- DELETE `/api/cart` - Clear cart

**Orders (Protected):**
- GET `/api/orders` - Get user's orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create order
- PUT `/api/orders/:id/cancel` - Cancel order

**Admin (Admin Only):**
- GET `/api/admin/dashboard-stats` - Dashboard statistics
- GET `/api/admin/products` - Get all products
- POST `/api/admin/products` - Create product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product
- GET `/api/admin/orders` - Get all orders
- PUT `/api/admin/orders/:id/status` - Update order status
- PUT `/api/admin/orders/:id/assign-delivery` - Assign delivery

**Delivery (Delivery Only):**
- GET `/api/delivery/my-deliveries` - Get assigned deliveries
- GET `/api/delivery/my-deliveries/:id` - Get delivery details
- PUT `/api/delivery/my-deliveries/:id/status` - Update delivery status

For detailed API documentation, see `backend/API_DOCUMENTATION.md`

## Frontend Setup

### Directory Structure
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── NavbarAuth.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── context/             # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProductsPage.tsx
│   │   │   ├── AdminProductFormPage.tsx
│   │   │   ├── AdminOrdersPage.tsx
│   │   │   └── AdminOrderDetailPage.tsx
│   │   └── delivery/
│   │       ├── DeliveryDashboard.tsx
│   │       ├── DeliveryOrdersPage.tsx
│   │       └── DeliveryOrderDetailPage.tsx
│   ├── config/
│   │   └── api.ts           # API configuration
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── vite.config.ts
```

### Routes

**Public Routes:**
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/products` - Product listing
- `/products/:id` - Product details

**Customer Routes (Protected):**
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/orders/:id` - Order details

**Admin Routes (Admin Only):**
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/:id` - Edit product
- `/admin/orders` - Order management
- `/admin/orders/:id` - Order details

**Delivery Routes (Delivery Only):**
- `/delivery` - Delivery dashboard
- `/delivery/orders` - Delivery list
- `/delivery/orders/:id` - Delivery details

## Testing

### Testing the Application

1. **Register Test Accounts:**
   - Go to http://localhost:5173/register
   - Create customer account

2. **Use Seeded Accounts:**
   - Admin: `admin@raithane.com` / `admin123`
   - Delivery: `delivery@raithane.com` / `delivery123`

3. **Test Customer Flow:**
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Place order
   - View order status

4. **Test Admin Flow:**
   - Login as admin
   - Create products
   - Manage categories
   - View orders
   - Assign delivery

5. **Test Delivery Flow:**
   - Login as delivery person
   - View assigned deliveries
   - Update delivery status

### API Testing with curl

See `backend/API_DOCUMENTATION.md` for curl examples.

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/raithane
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Common Issues and Solutions

### CORS Errors
**Problem:** Frontend can't connect to backend

**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS is enabled in `backend/index.js`

### MongoDB Connection Error
**Problem:** Can't connect to MongoDB

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP

### JWT Errors
**Problem:** Authentication fails

**Solution:**
- Clear localStorage in browser
- Check `JWT_SECRET` is set
- Verify token format in API requests

### Cloudinary Errors
**Problem:** Image uploads fail

**Solution:**
- Verify Cloudinary credentials
- Check account limits
- Test with Cloudinary dashboard

## Production Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Create new service
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Create new project
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

### Database (MongoDB Atlas)

1. Create cluster
2. Create database user
3. Whitelist IPs (or use 0.0.0.0/0 for development)
4. Get connection string
5. Update `MONGODB_URI`

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Implement CSRF protection
- [ ] Add security headers (helmet.js)
- [ ] Regular dependency updates

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Implement Redis caching
- [ ] Optimize database queries (indexes)
- [ ] Use CDN for static assets
- [ ] Lazy load images
- [ ] Code splitting in React
- [ ] Minify and bundle assets

## Documentation

- Backend API: `backend/API_DOCUMENTATION.md`
- Frontend Guide: `frontend/FRONTEND_README.md`
- Architecture: `backend/ARCHITECTURE.md`
- Quick Start: `backend/QUICK_START.md`

## Support

For issues or questions:
1. Check documentation files
2. Review error logs
3. Create GitHub issue
4. Contact development team

## License

MIT

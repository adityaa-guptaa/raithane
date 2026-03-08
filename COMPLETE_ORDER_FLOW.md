# Raithane E-Commerce Platform - Complete Setup Guide

## 🎯 Project Overview

Raithane is a full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a complete order management system with role-based access control for customers, admins, and delivery personnel.

## 📋 Features

### Customer Features

- ✅ User authentication (Register/Login)
- ✅ Browse products by categories
- ✅ Add products to cart and wishlist
- ✅ Complete checkout process with shipping address
- ✅ Place orders with COD payment
- ✅ View order history and track orders
- ✅ Cancel pending orders
- ✅ Beautiful order success page with animations

### Admin Features

- ✅ Dashboard with statistics
- ✅ Product management (CRUD operations)
- ✅ Category management
- ✅ Order management and status updates
- ✅ Assign delivery personnel to orders
- ✅ View all users and orders

### Delivery Personnel Features

- ✅ View assigned deliveries
- ✅ Update delivery status
- ✅ Track delivery statistics

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Vite** for build tooling

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image storage
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### 1. Clone the Repository

```bash
cd /Users/adityagupta/Personal/raithane
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your credentials:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Random secret key for JWT
# - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
# - CLOUDINARY_API_KEY: Your Cloudinary API key
# - CLOUDINARY_API_SECRET: Your Cloudinary API secret
# - PORT: Backend port (default: 5001)
# - FRONTEND_URL: Frontend URL (default: http://localhost:5173)

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file:
# - VITE_API_URL: Backend API URL (default: http://localhost:5001/api)

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Default User Accounts

The system automatically creates default accounts on first run:

### Admin Account

- **Email**: admin@raithane.com
- **Password**: admin123
- **Role**: admin

### Delivery Person Account

- **Email**: delivery@raithane.com
- **Password**: delivery123
- **Role**: delivery

### Customer Account

You can register a new customer account through the registration page.

## 🚀 Order Flow

### Complete Order Process

1. **Browse Products**

   - Customer browses products on the homepage or products page
   - Can filter by categories

2. **Add to Cart**

   - Click "Add to Cart" on any product
   - View cart summary in the navbar
   - Manage quantities in the cart page

3. **Checkout**

   - Click "Proceed to Checkout" from cart
   - Fill in shipping address details
   - Review order summary (subtotal, shipping, tax)
   - Select payment method (COD)

4. **Place Order**

   - Click "Place Order" button
   - Order is created in the database
   - Cart is automatically cleared
   - Product stock is reduced
   - Order number is generated (e.g., ORD-12345678901)

5. **Order Success**

   - Beautiful success page with animations
   - Shows order process steps
   - Auto-redirects to orders page in 10 seconds
   - Can manually navigate to "My Orders" or continue shopping

6. **Track Order**
   - View all orders in "My Orders" page
   - Click on any order to see details
   - Track order status through timeline:
     - Pending → Confirmed → Processing → Picked Up → Out for Delivery → Delivered
   - Can cancel order if status is "pending"

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin/delivery),
  phone: String,
  address: Object,
  isActive: Boolean
}
```

### Product Model

```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: ObjectId (ref: Category),
  images: Array,
  isActive: Boolean,
  isFeatured: Boolean
}
```

### Order Model

```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String (cod/online/card),
  paymentStatus: String (pending/paid/failed),
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  status: String (pending/confirmed/processing/picked_up/out_for_delivery/delivered/cancelled),
  deliveryPerson: ObjectId (ref: User),
  statusHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  name: String,
  description: String,
  image: Object,
  isActive: Boolean
}
```

### Cart Model

```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number
}
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/update-password` - Update password

### Products

- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin Routes

- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/assign-delivery` - Assign delivery person

### Delivery Routes

- `GET /api/delivery/my-deliveries` - Get assigned deliveries
- `PUT /api/delivery/my-deliveries/:id/status` - Update delivery status

## 🎨 Frontend Pages

### Public Pages

- `/` - Homepage
- `/products` - Products listing
- `/products/:id` - Product detail
- `/login` - Login page
- `/register` - Registration page

### Customer Pages (Protected)

- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/order-success` - Order success page
- `/orders` - Order history
- `/orders/:id` - Order detail
- `/wishlist` - Wishlist

### Admin Pages (Protected)

- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/orders/:id` - Order detail

### Delivery Pages (Protected)

- `/delivery` - Delivery dashboard
- `/delivery/orders` - Assigned deliveries
- `/delivery/orders/:id` - Delivery detail

## 🧪 Testing the Order Flow

1. **Start both servers**:

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Register/Login as customer**:

   - Go to http://localhost:5173
   - Click "Register" and create an account
   - Or login with existing credentials

3. **Add products to cart**:

   - Browse products on homepage
   - Click "Add to Cart" on any product
   - View cart by clicking cart icon in navbar

4. **Complete checkout**:

   - Click "Proceed to Checkout" in cart
   - Fill in shipping address
   - Review order summary
   - Click "Place Order"

5. **View order success**:

   - See beautiful success animation
   - Wait for auto-redirect or click "View My Orders"

6. **Track order**:
   - View order in "My Orders" page
   - Click on order to see details
   - See order timeline and status

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:

- Check if MongoDB URI is correct in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify network connectivity

**Port Already in Use**:

- Change `PORT` in backend `.env` file
- Update `VITE_API_URL` in frontend `.env` accordingly

**Cloudinary Upload Error**:

- Verify Cloudinary credentials in `.env`
- Check Cloudinary account status

### Frontend Issues

**API Connection Error**:

- Ensure backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**Order Creation Fails**:

- Check if user is logged in
- Verify cart has items
- Check browser console for errors
- Ensure all required fields are filled

## 📝 Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions, contact the development team.

---

**Last Updated**: January 2026
**Version**: 1.0.0

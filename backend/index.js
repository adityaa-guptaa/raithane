import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { configureCloudinary } from './config/cloudinary.js';
import { seedAdmin, seedDeliveryPerson } from './seeds/seedUsers.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger (development only)
app.use(requestLogger);

// ============================================
// DATABASE & CLOUDINARY CONNECTION
// ============================================

// Connect to MongoDB
connectDB();

// Configure Cloudinary
configureCloudinary();

// Seed initial data (admin & delivery users)
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    seedAdmin();
    seedDeliveryPerson();
  }, 2000); // Wait for DB connection
}

// ============================================
// API ROUTES
// ============================================

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Raithane API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      admin: '/api/admin',
      delivery: '/api/delivery',
    },
  });
});

// API version prefix
const API_PREFIX = '/api';

// Mount routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/wishlist`, wishlistRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/delivery`, deliveryRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}${API_PREFIX}`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

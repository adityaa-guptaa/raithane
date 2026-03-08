import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/related/:productId', getRelatedProducts);
router.get('/:id', getProductById); // Must be last to avoid conflicts

export default router;

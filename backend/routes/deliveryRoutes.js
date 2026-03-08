import express from 'express';
import {
  getAssignedOrders,
  getOrderDetails,
  updateOrderStatus,
  getStatistics,
} from '../controllers/deliveryController.js';
import { protect, deliveryOnly } from '../middleware/auth.js';

const router = express.Router();

// All delivery routes require authentication and delivery role
router.use(protect, deliveryOnly);

// Main routes
router.get('/orders', getAssignedOrders);
router.get('/orders/:id', getOrderDetails);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/statistics', getStatistics);

// Route aliases for backward compatibility
router.get('/my-deliveries', getAssignedOrders);
router.get('/my-deliveries/:id', getOrderDetails);
router.put('/my-deliveries/:id/status', updateOrderStatus);

export default router;

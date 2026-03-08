import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getAllProductsAdmin,
  getProductById,
  toggleProductStatus,
} from '../controllers/adminProductController.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  getAllCategoriesAdmin,
  getCategoryById,
  toggleCategoryStatus,
} from '../controllers/adminCategoryController.js';
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  assignDeliveryPerson,
  getStatistics,
  getDashboardStats,
} from '../controllers/adminOrderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Product routes
router.route('/products')
  .get(getAllProductsAdmin)
  .post(createProduct);

router.route('/products/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.post('/products/:id/images', uploadProductImages);
router.delete('/products/:id/images/:imageId', deleteProductImage);
router.patch('/products/:id/toggle-status', toggleProductStatus);

// Category routes
router.route('/categories')
  .get(getAllCategoriesAdmin)
  .post(createCategory);

router.route('/categories/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

router.post('/categories/:id/image', uploadCategoryImage);
router.patch('/categories/:id/toggle-status', toggleCategoryStatus);

// Order routes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/assign-delivery', assignDeliveryPerson);

// Statistics
router.get('/statistics', getStatistics);
router.get('/dashboard-stats', getDashboardStats);

// Get delivery persons (active only - for dropdowns)
router.get('/users/delivery-persons', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const deliveryPersons = await User.find({ role: 'delivery', isActive: true })
      .select('name email phone')
      .lean();
    res.json({ success: true, data: deliveryPersons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all delivery persons (including inactive)
router.get('/delivery-persons', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const deliveryPersons = await User.find({ role: 'delivery' })
      .select('name email phone isActive createdAt')
      .sort('-createdAt')
      .lean();
    res.json({ success: true, data: deliveryPersons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create delivery person
router.post('/delivery-persons', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields: name, email, phone, password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'A user with this email already exists' 
      });
    }

    // Create delivery person
    const deliveryPerson = await User.create({
      name,
      email,
      phone,
      password,
      role: 'delivery',
      isActive: true,
    });

    // Return user without password
    const userResponse = {
      _id: deliveryPerson._id,
      name: deliveryPerson.name,
      email: deliveryPerson.email,
      phone: deliveryPerson.phone,
      role: deliveryPerson.role,
      isActive: deliveryPerson.isActive,
      createdAt: deliveryPerson.createdAt,
    };

    res.status(201).json({ 
      success: true, 
      data: userResponse,
      message: 'Delivery person created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle delivery person status
router.patch('/delivery-persons/:id/toggle-status', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const deliveryPerson = await User.findById(req.params.id);
    
    if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
      return res.status(404).json({ 
        success: false, 
        error: 'Delivery person not found' 
      });
    }

    deliveryPerson.isActive = !deliveryPerson.isActive;
    await deliveryPerson.save();

    res.json({ 
      success: true, 
      data: {
        _id: deliveryPerson._id,
        name: deliveryPerson.name,
        email: deliveryPerson.email,
        isActive: deliveryPerson.isActive,
      },
      message: `Delivery person ${deliveryPerson.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const customers = await User.find({ role: 'user' })
      .select('name email phone address createdAt isActive')
      .sort('-createdAt')
      .lean();
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

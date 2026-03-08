import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { paginate, createPaginationResponse } from '../utils/pagination.js';

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = paginate(req);

  let query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  // Search by order number
  if (req.query.orderNumber) {
    query.orderNumber = { $regex: req.query.orderNumber, $options: 'i' };
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .populate('deliveryPerson', 'name phone')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  res.status(200).json(createPaginationResponse(orders, total, page, limit));
});

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order details
 * @access  Private/Admin
 */
export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('deliveryPerson', 'name phone email')
    .populate('items.product', 'name images')
    .populate('statusHistory.updatedBy', 'name role');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Update status
  order.status = status;

  // Add to status history
  order.statusHistory.push({
    status,
    note,
    updatedBy: req.user._id,
    timestamp: new Date(),
  });

  // Set delivered date if status is delivered
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }

  // Set cancelled date if status is cancelled
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    order.cancellationReason = note || 'Cancelled by admin';
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

/**
 * @route   PUT /api/admin/orders/:id/assign-delivery
 * @desc    Assign order to delivery person
 * @access  Private/Admin
 */
export const assignDeliveryPerson = asyncHandler(async (req, res, next) => {
  const { deliveryPersonId } = req.body;

  if (!deliveryPersonId) {
    return next(new ErrorResponse('Please provide delivery person ID', 400));
  }

  // Verify delivery person exists and has correct role
  const deliveryPerson = await User.findById(deliveryPersonId);

  if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
    return next(new ErrorResponse('Invalid delivery person', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Assign delivery person
  order.deliveryPerson = deliveryPersonId;
  order.status = 'processing'; // Update status when assigned

  // Add to delivery person's assigned orders
  if (!deliveryPerson.assignedOrders.includes(order._id)) {
    deliveryPerson.assignedOrders.push(order._id);
    await deliveryPerson.save();
  }

  // Add to status history
  order.statusHistory.push({
    status: 'processing',
    note: `Assigned to ${deliveryPerson.name}`,
    updatedBy: req.user._id,
    timestamp: new Date(),
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Delivery person assigned successfully',
  });
});

/**
 * @route   GET /api/admin/statistics
 * @desc    Get admin dashboard statistics
 * @access  Private/Admin
 */
export const getStatistics = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    todayOrders,
    totalRevenue,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get comprehensive dashboard statistics
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    // Order statistics
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    pickedUpOrders,
    outForDeliveryOrders,
    deliveredOrders,
    cancelledOrders,
    todayOrders,
    
    // Revenue statistics
    totalRevenue,
    monthlyRevenue,
    
    // Product statistics
    totalProducts,
    activeProducts,
    lowStockProducts,
    
    // User statistics
    totalUsers,
    
    // Recent orders
    recentOrders,
  ] = await Promise.all([
    // Order counts
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'confirmed' }),
    Order.countDocuments({ status: 'processing' }),
    Order.countDocuments({ status: 'picked_up' }),
    Order.countDocuments({ status: 'out_for_delivery' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'cancelled' }),
    Order.countDocuments({ createdAt: { $gte: today } }),
    
    // Revenue
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'out_for_delivery', 'picked_up', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      { 
        $match: { 
          status: { $in: ['delivered', 'out_for_delivery', 'picked_up', 'processing'] },
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    
    // Products
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
    
    // Users
    User.countDocuments({ role: 'user' }),
    
    // Recent orders
    Order.find()
      .populate('user', 'name email phone')
      .populate('deliveryPerson', 'name')
      .sort('-createdAt')
      .limit(10)
      .lean(),
  ]);

  // Calculate order status breakdown
  const statusBreakdown = {
    pending: pendingOrders,
    confirmed: confirmedOrders,
    processing: processingOrders,
    picked_up: pickedUpOrders,
    out_for_delivery: outForDeliveryOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
  };

  res.status(200).json({
    success: true,
    data: {
      // Overview stats
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalProducts,
      activeProducts,
      totalUsers,
      
      // Order stats
      pendingOrders,
      todayOrders,
      deliveredOrders,
      cancelledOrders,
      
      // Status breakdown
      statusBreakdown,
      
      // Alerts
      lowStockProducts,
      
      // Recent orders
      recentOrders,
    },
  });
});

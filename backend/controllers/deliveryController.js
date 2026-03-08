import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Order from '../models/Order.js';
import { paginate, createPaginationResponse } from '../utils/pagination.js';

/**
 * @route   GET /api/delivery/orders
 * @desc    Get orders assigned to delivery person
 * @access  Private/Delivery
 */
export const getAssignedOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = paginate(req);

  let query = { deliveryPerson: req.user._id };

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name phone')
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  res.status(200).json(createPaginationResponse(orders, total, page, limit));
});

/**
 * @route   GET /api/delivery/orders/:id
 * @desc    Get single order details
 * @access  Private/Delivery
 */
export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name phone')
    .populate('items.product', 'name images');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure order is assigned to this delivery person
  if (order.deliveryPerson?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @route   PUT /api/delivery/orders/:id/status
 * @desc    Update order status (picked_up, out_for_delivery, delivered)
 * @access  Private/Delivery
 */
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  // Delivery person can only update to these statuses
  const allowedStatuses = ['picked_up', 'out_for_delivery', 'delivered'];
  
  if (!allowedStatuses.includes(status)) {
    return next(
      new ErrorResponse(
        'Invalid status. Allowed: picked_up, out_for_delivery, delivered',
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure order is assigned to this delivery person
  if (order.deliveryPerson?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this order', 403));
  }

  // Validate status progression
  const statusFlow = {
    confirmed: ['picked_up'],
    processing: ['picked_up'],
    picked_up: ['out_for_delivery'],
    out_for_delivery: ['delivered'],
    shipped: ['out_for_delivery', 'delivered'], // Allow shipped to go to out_for_delivery or delivered
  };

  if (
    statusFlow[order.status] &&
    !statusFlow[order.status].includes(status)
  ) {
    return next(
      new ErrorResponse(
        `Cannot change status from ${order.status} to ${status}`,
        400
      )
    );
  }

  // Update order status
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
    order.paymentStatus = 'paid'; // Mark as paid for COD
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

/**
 * @route   GET /api/delivery/statistics
 * @desc    Get delivery person statistics
 * @access  Private/Delivery
 */
export const getStatistics = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalAssignedOrders,
    pendingPickup,
    outForDelivery,
    deliveredToday,
    totalDelivered,
  ] = await Promise.all([
    Order.countDocuments({ deliveryPerson: req.user._id }),
    Order.countDocuments({
      deliveryPerson: req.user._id,
      status: { $in: ['processing', 'picked_up'] },
    }),
    Order.countDocuments({
      deliveryPerson: req.user._id,
      status: 'out_for_delivery',
    }),
    Order.countDocuments({
      deliveryPerson: req.user._id,
      status: 'delivered',
      deliveredAt: { $gte: today },
    }),
    Order.countDocuments({
      deliveryPerson: req.user._id,
      status: 'delivered',
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalAssignedOrders,
      pendingPickup,
      outForDelivery,
      deliveredToday,
      totalDelivered,
    },
  });
});

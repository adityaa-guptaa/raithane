import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { paginate, createPaginationResponse } from '../utils/pagination.js';

/**
 * @route   POST /api/orders
 * @desc    Create new order from cart
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, customerNote } = req.body;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || 
      !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
      !shippingAddress.zipCode) {
    return next(new ErrorResponse('Please provide complete shipping address', 400));
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  // Validate all items and stock
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product || !product.isActive) {
      return next(new ErrorResponse(`Product ${item.product.name} is not available`, 400));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: product.images[0]?.secure_url,
    });

    itemsPrice += product.price * item.quantity;

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Calculate prices
  const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping over Rs.500
  const taxPrice = itemsPrice * 0.18; // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    customerNote,
    status: 'pending',
  });

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order placed successfully',
  });
});

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
export const getUserOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = paginate(req);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json(createPaginationResponse(orders, total, page, limit));
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images')
    .populate('deliveryPerson', 'name phone');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns this order (or is admin/delivery)
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin' &&
    (req.user.role !== 'delivery' || order.deliveryPerson?.toString() !== req.user._id.toString())
  ) {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order (only if pending)
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Only user can cancel their own order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Can only cancel pending orders
  if (order.status !== 'pending') {
    return next(new ErrorResponse('Cannot cancel order in current status', 400));
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.status = 'cancelled';
  order.cancelledAt = Date.now();
  order.cancellationReason = req.body.reason || 'Cancelled by user';
  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  });
});

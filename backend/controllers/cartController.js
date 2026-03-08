import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price images stock isActive');

  // Create cart if it doesn't exist
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Filter out inactive products or out of stock items
  cart.items = cart.items.filter(
    (item) => item.product && item.product.isActive && item.product.stock > 0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new ErrorResponse('Please provide product ID', 400));
  }

  // Verify product exists and is available
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
    
    // Check stock again
    if (cart.items[existingItemIndex].quantity > product.stock) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name price images stock isActive');

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item added to cart',
  });
});

/**
 * @route   PUT /api/cart/update/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 1) {
    return next(new ErrorResponse('Invalid quantity', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Check stock
  const product = await Product.findById(item.product);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not available', 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  item.quantity = quantity;
  item.price = product.price; // Update price in case it changed

  await cart.save();
  await cart.populate('items.product', 'name price images stock isActive');

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart updated',
  });
});

/**
 * @route   DELETE /api/cart/remove/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Remove item
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  await cart.save();
  await cart.populate('items.product', 'name price images stock isActive');

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item removed from cart',
  });
});

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart cleared',
  });
});

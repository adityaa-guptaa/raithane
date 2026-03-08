import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('items.product', 'name price images stock isActive isFeatured');

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  // Filter out inactive products
  wishlist.items = wishlist.items.filter(
    (item) => item.product && item.product.isActive
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

/**
 * @route   POST /api/wishlist/add
 * @desc    Add item to wishlist
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorResponse('Please provide product ID', 400));
  }

  // Verify product exists and is available
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Get or create wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  // Check if product already in wishlist
  const existingItem = wishlist.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    return next(new ErrorResponse('Product already in wishlist', 400));
  }

  // Add new item
  wishlist.items.push({
    product: productId,
  });

  await wishlist.save();
  await wishlist.populate('items.product', 'name price images stock isActive isFeatured');

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Item added to wishlist',
  });
});

/**
 * @route   DELETE /api/wishlist/remove/:productId
 * @desc    Remove item from wishlist
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  // Remove item
  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  );

  await wishlist.save();
  await wishlist.populate('items.product', 'name price images stock isActive isFeatured');

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Item removed from wishlist',
  });
});

/**
 * @route   DELETE /api/wishlist/clear
 * @desc    Clear all items from wishlist
 * @access  Private
 */
export const clearWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Wishlist cleared',
  });
});

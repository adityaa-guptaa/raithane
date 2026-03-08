import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { paginate, createPaginationResponse } from '../utils/pagination.js';

/**
 * @route   GET /api/products
 * @desc    Get all products with filters and pagination
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = paginate(req);
  
  // Build query
  let query = {};

  // Filter by category (support both _id and slug)
  if (req.query.category) {
    let category;
    if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ID
      category = await Category.findById(req.query.category);
    } else {
      // It's a slug
      category = await Category.findOne({ slug: req.query.category });
    }
    if (category) {
      query.category = category._id;
    }
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Filter by featured, new arrival, trending, best seller, on sale, organic
  if (req.query.isFeatured === 'true') query.isFeatured = true;
  if (req.query.isNewArrival === 'true') query.isNewArrival = true;
  if (req.query.isTrending === 'true') query.isTrending = true;
  if (req.query.isBestSeller === 'true') query.isBestSeller = true;
  if (req.query.isOnSale === 'true') query.isOnSale = true;
  if (req.query.isOrganic === 'true') query.isOrganic = true;

  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  // Sort
  let sort = '-createdAt'; // Default: newest first
  if (req.query.sort === 'price-asc') sort = 'price';
  if (req.query.sort === 'price-desc') sort = '-price';
  if (req.query.sort === 'name') sort = 'name';
  if (req.query.sort === 'rating') sort = '-rating';

  // Execute query
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  res.status(200).json(createPaginationResponse(products, total, page, limit));
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID or slug
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  let product;

  // Try to find by ID first, then by slug
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(req.params.id).populate('category', 'name slug');
  } else {
    product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
  }

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Increment views
  product.views += 1;
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: products,
  });
});

/**
 * @route   GET /api/products/new-arrivals
 * @desc    Get new arrival products
 * @access  Public
 */
export const getNewArrivals = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const products = await Product.find({ isActive: true, isNewArrival: true })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: products,
  });
});

/**
 * @route   GET /api/products/related/:productId
 * @desc    Get related products (same category)
 * @access  Public
 */
export const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const limit = parseInt(req.query.limit, 10) || 4;

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: relatedProducts,
  });
});

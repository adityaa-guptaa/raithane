import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Category from '../models/Category.js';

/**
 * @route   GET /api/categories
 * @desc    Get all active categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({})
    .sort('sortOrder name')
    .lean();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID or slug
 * @access  Public
 */
export const getCategoryById = asyncHandler(async (req, res, next) => {
  let category;

  // Try to find by ID first, then by slug
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(req.params.id);
  } else {
    category = await Category.findOne({ slug: req.params.id });
  }

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

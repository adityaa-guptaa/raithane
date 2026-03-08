import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Category from '../models/Category.js';
import { cloudinary } from '../config/cloudinary.js';

/**
 * @route   POST /api/admin/categories
 * @desc    Create new category
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, sortOrder } = req.body;

  if (!name) {
    return next(new ErrorResponse('Please provide category name', 400));
  }

  const category = await Category.create({
    name,
    description,
    sortOrder,
  });

  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully',
  });
});

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
    message: 'Category updated successfully',
  });
});

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Delete image from Cloudinary if exists
  if (category.image && category.image.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

/**
 * @route   POST /api/admin/categories/:id/image
 * @desc    Upload category image
 * @access  Private/Admin
 */
export const uploadCategoryImage = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  if (!req.body.image) {
    return next(new ErrorResponse('Please provide image data', 400));
  }

  // Delete old image if exists
  if (category.image && category.image.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }

  // Upload new image
  const result = await cloudinary.uploader.upload(req.body.image, {
    folder: 'raithane/categories',
    transformation: [
      { width: 400, height: 400, crop: 'limit' },
      { quality: 'auto' },
    ],
  });

  category.image = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  await category.save();

  res.status(200).json({
    success: true,
    data: category,
    message: 'Category image uploaded successfully',
  });
});

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories (including inactive) for admin
 * @access  Private/Admin
 */
export const getAllCategoriesAdmin = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('sortOrder name');

  res.status(200).json({
    success: true,
    data: categories,
  });
});

/**
 * @route   GET /api/admin/categories/:id
 * @desc    Get single category by ID for admin
 * @access  Private/Admin
 */
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @route   PATCH /api/admin/categories/:id/toggle-status
 * @desc    Toggle category active status
 * @access  Private/Admin
 */
export const toggleCategoryStatus = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    data: category,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'}`,
  });
});

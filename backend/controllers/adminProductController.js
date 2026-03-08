import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { cloudinary } from '../config/cloudinary.js';
import { paginate, createPaginationResponse } from '../utils/pagination.js';

/**
 * @route   POST /api/admin/products
 * @desc    Create new product
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    shortDescription,
    price,
    originalPrice,
    discount,
    category,
    stock,
    specifications,
    tags,
    isFeatured,
    isNewArrival,
    isTrending,
    isBestSeller,
    isOnSale,
    isOrganic,
    images,
  } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Verify category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Convert specifications array to Map
  let specsMap = new Map();
  if (specifications && Array.isArray(specifications)) {
    specifications.forEach(spec => {
      if (spec.key && spec.value) {
        specsMap.set(spec.key, spec.value);
      }
    });
  } else if (specifications && typeof specifications === 'object') {
    specsMap = new Map(Object.entries(specifications));
  }

  // Filter out invalid images (those without required fields)
  const validImages = images && Array.isArray(images) 
    ? images.filter(img => img.public_id && img.secure_url)
    : [];

  const product = await Product.create({
    name,
    description,
    shortDescription,
    price,
    originalPrice,
    discount,
    category,
    stock: stock || 0,
    specifications: specsMap,
    tags,
    isFeatured,
    isNewArrival,
    isTrending,
    isBestSeller,
    isOnSale,
    isOrganic,
    images: validImages,
  });

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // If category is being updated, verify it exists
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new ErrorResponse('Category not found', 404));
    }
  }

  // Convert specifications array to Map if provided
  if (req.body.specifications) {
    if (Array.isArray(req.body.specifications)) {
      const specsMap = new Map();
      req.body.specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specsMap.set(spec.key, spec.value);
        }
      });
      req.body.specifications = specsMap;
    } else if (typeof req.body.specifications === 'object' && !(req.body.specifications instanceof Map)) {
      req.body.specifications = new Map(Object.entries(req.body.specifications));
    }
  }

  // Filter out invalid images if images are being updated
  // For new images: require both public_id and secure_url (newly uploaded from Cloudinary)
  // For existing images: only require secure_url (already in database)
  if (req.body.images && Array.isArray(req.body.images)) {
    req.body.images = req.body.images.filter(img => 
      img.secure_url && (img.public_id || img.public_id === '')
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  res.status(200).json({
    success: true,
    data: product,
    message: 'Product updated successfully',
  });
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Delete images from Cloudinary
  for (const image of product.images) {
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * @route   POST /api/admin/products/:id/images
 * @desc    Upload product images to Cloudinary
 * @access  Private/Admin
 */
export const uploadProductImages = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (!req.body.images || !Array.isArray(req.body.images)) {
    return next(new ErrorResponse('Please provide images array', 400));
  }

  // Upload images to Cloudinary
  const uploadedImages = [];

  for (const imageData of req.body.images) {
    try {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: 'raithane/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
      });

      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    } catch (error) {
      return next(new ErrorResponse('Error uploading image', 500));
    }
  }

  // Add to product images
  product.images.push(...uploadedImages);
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
    message: `${uploadedImages.length} image(s) uploaded successfully`,
  });
});

/**
 * @route   DELETE /api/admin/products/:id/images/:imageId
 * @desc    Delete product image
 * @access  Private/Admin
 */
export const deleteProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const image = product.images.id(req.params.imageId);

  if (!image) {
    return next(new ErrorResponse('Image not found', 404));
  }

  // Delete from Cloudinary
  if (image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  // Remove from product
  product.images = product.images.filter(
    (img) => img._id.toString() !== req.params.imageId
  );

  await product.save();

  res.status(200).json({
    success: true,
    data: product,
    message: 'Image deleted successfully',
  });
});

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get single product by ID for admin
 * @access  Private/Admin
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including inactive) for admin
 * @access  Private/Admin
 */
export const getAllProductsAdmin = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = paginate(req);

  // Build query (no isActive filter)
  let query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive) {
    query.isActive = req.query.isActive === 'true';
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  res.status(200).json(createPaginationResponse(products, total, page, limit));
});

/**
 * @route   PATCH /api/admin/products/:id/toggle-status
 * @desc    Toggle product active status
 * @access  Private/Admin
 */
export const toggleProductStatus = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product.isActive = !product.isActive;
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
    message: `Product ${product.isActive ? 'activated' : 'deactivated'}`,
  });
});

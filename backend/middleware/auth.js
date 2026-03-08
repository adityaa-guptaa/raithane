import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

/**
 * Protect Routes - Verify JWT Token
 * Middleware to authenticate users
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/**
 * Admin Only Middleware
 * Restricts access to admin role
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(
      new ErrorResponse('Access denied. Admin privileges required', 403)
    );
  }
});

/**
 * Delivery Only Middleware
 * Restricts access to delivery role
 */
export const deliveryOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    next();
  } else {
    return next(
      new ErrorResponse('Access denied. Delivery personnel only', 403)
    );
  }
});

/**
 * Authorize Roles
 * Generic middleware to authorize multiple roles
 * Usage: authorize('admin', 'delivery')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

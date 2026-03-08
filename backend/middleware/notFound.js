import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Not Found Middleware
 * Handles 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

export default notFound;

/**
 * Custom Error Handler Class
 * Extends the built-in Error class with status code
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;

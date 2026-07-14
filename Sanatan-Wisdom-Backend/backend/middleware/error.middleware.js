const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? STATUS_CODES.BAD_REQUEST : STATUS_CODES.INTERNAL_SERVER_ERROR);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  // Handle specific database errors
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    error = new ApiError(STATUS_CODES.BAD_REQUEST, `Invalid ID format for ${error.path}`);
  }

  // Handle duplicate key errors (MongoDB code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(STATUS_CODES.CONFLICT, `Duplicate value for field: ${field}. Please use another value.`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(STATUS_CODES.UNAUTHORIZED, 'Token has expired. Please log in again.');
  }

  const response = {
    success: false,
    message: error.message,
    data: null,
    errors: error.errors || []
  };

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    console.error(error);
  }

  res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json(response);
};

module.exports = errorMiddleware;

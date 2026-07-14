const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));

  throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Request validation failed', extractedErrors);
};

module.exports = {
  validate
};

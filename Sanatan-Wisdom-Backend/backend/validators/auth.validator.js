const { body } = require('express-validator');
const { validate } = require('./index');

const signupValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidator = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),
  body('username')
    .optional()
    .trim()
    .notEmpty().withMessage('Username cannot be empty'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  // Ensure at least username or email is provided
  (req, res, next) => {
    if (!req.body.email && !req.body.username) {
      const { validate } = require('./index');
      const ApiError = require('../utils/apiError');
      const { STATUS_CODES } = require('../constants');
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide either username or email to login');
    }
    next();
  },
  validate
];

const updateProfileValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  body('profileImage')
    .optional()
    .trim()
    .isURL().withMessage('Profile image must be a valid URL'),
  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark']).withMessage('Theme must be either light or dark'),
  body('preferences.fontSize')
    .optional()
    .isIn(['small', 'medium', 'large']).withMessage('Font size must be small, medium, or large'),
  validate
];

module.exports = {
  signupValidator,
  loginValidator,
  updateProfileValidator
};

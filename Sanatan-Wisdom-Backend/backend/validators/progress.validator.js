const { body } = require('express-validator');
const { validate } = require('./index');

const saveProgressValidator = [
  body('book')
    .trim()
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Book ID must be a valid Mongo ID'),
  body('chapter')
    .trim()
    .notEmpty().withMessage('Chapter ID is required')
    .isMongoId().withMessage('Chapter ID must be a valid Mongo ID'),
  body('progressPercent')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('progressPercent must be a number between 0 and 100'),
  body('lastReadPosition')
    .optional()
    .isInt({ min: 0 }).withMessage('lastReadPosition must be a positive integer'),
  validate
];

module.exports = {
  saveProgressValidator
};

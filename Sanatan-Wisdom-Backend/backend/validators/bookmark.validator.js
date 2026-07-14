const { body } = require('express-validator');
const { validate } = require('./index');

const createBookmarkValidator = [
  body('book')
    .trim()
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Book ID must be a valid Mongo ID'),
  body('chapter')
    .trim()
    .notEmpty().withMessage('Chapter ID is required')
    .isMongoId().withMessage('Chapter ID must be a valid Mongo ID'),
  validate
];

module.exports = {
  createBookmarkValidator
};

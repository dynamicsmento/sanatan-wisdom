const { body, param, query } = require('express-validator');
const { validate } = require('./index');

const createBookValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Book title is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Book description is required'),
  body('author')
    .trim()
    .notEmpty().withMessage('Author name is required'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category ID is required')
    .isMongoId().withMessage('Category must be a valid Mongo ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array of strings'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),
  validate
];

const createChapterValidator = [
  body('book')
    .trim()
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Book ID must be a valid Mongo ID'),
  body('chapterNumber')
    .notEmpty().withMessage('Chapter number is required')
    .isInt({ min: 1 }).withMessage('Chapter number must be a positive integer'),
  body('title')
    .trim()
    .notEmpty().withMessage('Chapter title is required'),
  body('content')
    .trim()
    .notEmpty().withMessage('Chapter content is required'),
  body('audioUrl')
    .optional()
    .trim()
    .isURL().withMessage('Audio URL must be a valid URL'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),
  validate
];

const getBooksValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page number must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid Mongo ID'),
  query('search')
    .optional()
    .trim(),
  validate
];

const mongoIdParamValidator = (paramName) => [
  param(paramName)
    .isMongoId().withMessage(`Invalid parameter format: ${paramName} must be a valid Mongo ID`),
  validate
];

module.exports = {
  createBookValidator,
  createChapterValidator,
  getBooksValidator,
  mongoIdParamValidator
};

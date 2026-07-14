const { body } = require('express-validator');
const { validate } = require('./index');

const createNoteValidator = [
  body('book')
    .trim()
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Book ID must be a valid Mongo ID'),
  body('chapter')
    .trim()
    .notEmpty().withMessage('Chapter ID is required')
    .isMongoId().withMessage('Chapter ID must be a valid Mongo ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Note content cannot be empty'),
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean'),
  validate
];

const updateNoteValidator = [
  body('content')
    .optional()
    .trim()
    .notEmpty().withMessage('Note content cannot be empty if provided'),
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean'),
  validate
];

module.exports = {
  createNoteValidator,
  updateNoteValidator
};

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const chapterController = require('../controllers/chapter.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');
const { ROLES } = require('../constants');
const {
  createBookValidator,
  createChapterValidator,
  getBooksValidator,
  mongoIdParamValidator
} = require('../validators/book.validator');

// Books Routes
router.get('/', getBooksValidator, bookController.getBooks);
router.post('/', verifyJWT, restrictTo(ROLES.ADMIN), createBookValidator, bookController.createBook);
router.get('/:id', mongoIdParamValidator('id'), bookController.getBookById);

// Chapters Routes
router.get('/:bookId/chapters', mongoIdParamValidator('bookId'), chapterController.getChapters);
router.post('/chapters', verifyJWT, restrictTo(ROLES.ADMIN), createChapterValidator, chapterController.createChapter);
router.get('/chapters/:id', mongoIdParamValidator('id'), chapterController.getChapterById);

module.exports = router;

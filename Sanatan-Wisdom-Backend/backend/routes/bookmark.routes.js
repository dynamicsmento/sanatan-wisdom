const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { createBookmarkValidator } = require('../validators/bookmark.validator');
const { mongoIdParamValidator } = require('../validators/book.validator');

// All bookmark routes require authentication
router.use(verifyJWT);

router.post('/', createBookmarkValidator, bookmarkController.addBookmark);
router.delete('/:id', mongoIdParamValidator('id'), bookmarkController.removeBookmark);
router.get('/', bookmarkController.getBookmarks);

module.exports = router;

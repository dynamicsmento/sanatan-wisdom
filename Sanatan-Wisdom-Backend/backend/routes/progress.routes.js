const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { saveProgressValidator } = require('../validators/progress.validator');
const { mongoIdParamValidator } = require('../validators/book.validator');

// All progress routes require authentication
router.use(verifyJWT);

router.post('/', saveProgressValidator, progressController.saveProgress);
router.get('/continue', progressController.getContinueReading);
router.get('/:bookId', mongoIdParamValidator('bookId'), progressController.getBookProgress);

module.exports = router;

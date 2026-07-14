const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

// All search routes require authentication (since it searches private notes)
router.use(verifyJWT);

router.get('/', searchController.search);

module.exports = router;

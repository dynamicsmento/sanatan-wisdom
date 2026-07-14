const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { updateProfileValidator } = require('../validators/auth.validator');

// All profile routes require authentication
router.use(verifyJWT);

router.get('/', profileController.getProfile);
router.put('/', updateProfileValidator, profileController.updateProfile);

module.exports = router;

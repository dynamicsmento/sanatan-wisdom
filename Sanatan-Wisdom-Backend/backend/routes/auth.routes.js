const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { signupValidator, loginValidator } = require('../validators/auth.validator');

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/refresh-token', authController.refreshAccessToken);

// Protected routes
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.getMe);

module.exports = router;

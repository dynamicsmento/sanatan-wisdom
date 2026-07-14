const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');
const noteRoutes = require('./note.routes');
const bookmarkRoutes = require('./bookmark.routes');
const progressRoutes = require('./progress.routes');
const profileRoutes = require('./profile.routes');
const searchRoutes = require('./search.routes');

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/notes', noteRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/progress', progressRoutes);
router.use('/profile', profileRoutes);
router.use('/search', searchRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy and running',
    timestamp: new Date()
  });
});

module.exports = router;

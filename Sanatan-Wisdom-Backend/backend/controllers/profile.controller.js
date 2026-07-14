const User = require('../models/User');
const Note = require('../models/Note');
const Bookmark = require('../models/Bookmark');
const ReadingProgress = require('../models/ReadingProgress');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Retrieve user statistics
  const [notesCount, bookmarksCount, inProgressCount, completedCount] = await Promise.all([
    Note.countDocuments({ user: userId }),
    Bookmark.countDocuments({ user: userId }),
    ReadingProgress.countDocuments({ user: userId, progressPercent: { $lt: 100 } }),
    ReadingProgress.countDocuments({ user: userId, progressPercent: 100 })
  ]);

  const profileData = {
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt
    },
    statistics: {
      notesCreated: notesCount,
      bookmarksSaved: bookmarksCount,
      booksInProgress: inProgressCount,
      booksCompleted: completedCount
    }
  };

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, profileData, 'Profile details retrieved successfully')
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, profileImage, preferences } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  // Handle unique username check if updating
  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'Username is already taken');
    }
    user.username = username;
  }

  if (profileImage !== undefined) {
    user.profileImage = profileImage;
  }

  if (preferences) {
    user.preferences = {
      ...user.preferences.toObject(),
      ...preferences
    };
  }

  await user.save();
  const updatedUser = await User.findById(userId).populate('role').select('-password -refreshToken');

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { user: updatedUser }, 'Profile updated successfully')
  );
});

module.exports = {
  getProfile,
  updateProfile
};

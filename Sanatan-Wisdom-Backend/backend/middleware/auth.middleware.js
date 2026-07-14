const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/jwt');
const { STATUS_CODES } = require('../constants');
const asyncHandler = require('../utils/asyncHandler');

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access token is missing or unauthorized request');
    }

    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid or expired access token');
    }

    const user = await User.findById(decodedToken._id).populate('role');
    if (!user) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid access token. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, error?.message || 'Invalid access token');
  }
});

module.exports = {
  verifyJWT
};

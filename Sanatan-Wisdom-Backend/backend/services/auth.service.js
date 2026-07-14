const User = require('../models/User');
const Role = require('../models/Role');
const ApiError = require('../utils/apiError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { STATUS_CODES, ROLES } = require('../constants');

class AuthService {
  async register({ username, email, password }) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'User with this email or username already exists');
    }

    // Default to USER role
    let userRole = await Role.findOne({ name: ROLES.USER });
    if (!userRole) {
      // Fallback in case seeding did not run
      userRole = await Role.create({
        name: ROLES.USER,
        description: 'Default application user role'
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: userRole._id
    });

    const user = await User.findById(newUser._id).populate('role').select('-password');
    return user;
  }

  async login({ email, username, password }) {
    const query = email ? { email } : { username };
    const user = await User.findOne(query).populate('role');
    if (!user) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).populate('role').select('-password -refreshToken');

    return {
      user: loggedInUser,
      accessToken,
      refreshToken
    };
  }

  async logout(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 }
      },
      { new: true }
    );

    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
    }

    return true;
  }

  async refreshAccessToken(token) {
    const decodedToken = verifyRefreshToken(token);
    if (!decodedToken) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decodedToken._id).populate('role');
    if (!user) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found');
    }

    if (user.refreshToken !== token) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Refresh token is expired or used');
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId).populate('role').select('-password -refreshToken');
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
    }
    return user;
  }
}

module.exports = new AuthService();

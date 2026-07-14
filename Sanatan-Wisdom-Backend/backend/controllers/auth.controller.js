const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

// Cookie options for secure storage
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days matching token expiry
};

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.register({ username, email, password });
  
  res.status(STATUS_CODES.CREATED).json(
    new ApiResponse(STATUS_CODES.CREATED, { user }, 'User registered successfully')
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, username, password });

  // Store refresh token in secure cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { user, accessToken }, 'Login successful')
  );
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, null, 'Logged out successfully')
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Try to read token from cookies or fallback to body
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    res.status(STATUS_CODES.UNAUTHORIZED).json(
      new ApiResponse(STATUS_CODES.UNAUTHORIZED, null, 'Refresh token is missing')
    );
    return;
  }

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(incomingRefreshToken);

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { accessToken }, 'Access token refreshed successfully')
  );
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { user }, 'Current user profile fetched successfully')
  );
});

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe
};

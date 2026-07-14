const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'User authentication required for this action'));
    }

    const userRole = req.user.role.name;
    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError(STATUS_CODES.FORBIDDEN, `Access denied. Role '${userRole}' is not permitted to perform this action`));
    }

    next();
  };
};

module.exports = {
  restrictTo
};

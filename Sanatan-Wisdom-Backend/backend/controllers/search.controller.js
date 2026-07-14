const searchService = require('../services/search.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const search = asyncHandler(async (req, res) => {
  const queryText = req.query.q || req.query.query;
  const userId = req.user ? req.user._id : null;

  const results = await searchService.globalSearch(userId, queryText);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, results, 'Search results fetched successfully')
  );
});

module.exports = {
  search
};

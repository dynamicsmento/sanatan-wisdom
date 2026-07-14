const progressService = require('../services/progress.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const saveProgress = asyncHandler(async (req, res) => {
  const { book, chapter, progressPercent, lastReadPosition } = req.body;
  const progress = await progressService.saveProgress(req.user._id, {
    book,
    chapter,
    progressPercent,
    lastReadPosition
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { progress }, 'Reading progress saved successfully')
  );
});

const getBookProgress = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const progress = await progressService.getBookProgress(req.user._id, bookId);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { progress }, 'Book progress retrieved successfully')
  );
});

const getContinueReading = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const result = await progressService.getContinueReading(req.user._id, { limit });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, result, 'Continue reading list retrieved successfully')
  );
});

module.exports = {
  saveProgress,
  getBookProgress,
  getContinueReading
};

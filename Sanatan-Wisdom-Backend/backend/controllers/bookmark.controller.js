const bookmarkService = require('../services/bookmark.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const addBookmark = asyncHandler(async (req, res) => {
  const { book, chapter } = req.body;
  const bookmark = await bookmarkService.addBookmark(req.user._id, { book, chapter });

  res.status(STATUS_CODES.CREATED).json(
    new ApiResponse(STATUS_CODES.CREATED, { bookmark }, 'Chapter bookmarked successfully')
  );
});

const removeBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await bookmarkService.removeBookmark(id, req.user._id);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, null, 'Bookmark removed successfully')
  );
});

const getBookmarks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await bookmarkService.getBookmarks(req.user._id, { page, limit });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, result, 'Bookmarks retrieved successfully')
  );
});

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks
};

const bookService = require('../services/book.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const getChapters = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { page, limit } = req.query;

  // Non-admins can only see published chapters
  const isPublished = req.user && req.user.role.name === 'ADMIN' ? undefined : true;

  const result = await bookService.getChaptersByBookId(bookId, { page, limit, isPublished });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, result, 'Chapters retrieved successfully')
  );
});

const getChapterById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chapter = await bookService.getChapterById(id);

  // Access check
  if (!chapter.isPublished && (!req.user || req.user.role.name !== 'ADMIN')) {
    res.status(STATUS_CODES.FORBIDDEN).json(
      new ApiResponse(STATUS_CODES.FORBIDDEN, null, 'This chapter is not published yet')
    );
    return;
  }

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { chapter }, 'Chapter details retrieved successfully')
  );
});

const createChapter = asyncHandler(async (req, res) => {
  const chapter = await bookService.createChapter(req.body);

  res.status(STATUS_CODES.CREATED).json(
    new ApiResponse(STATUS_CODES.CREATED, { chapter }, 'Chapter created successfully')
  );
});

module.exports = {
  getChapters,
  getChapterById,
  createChapter
};

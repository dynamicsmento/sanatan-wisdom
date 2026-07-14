const bookService = require('../services/book.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS_CODES } = require('../constants');

const getBooks = asyncHandler(async (req, res) => {
  const { category, search, page, limit } = req.query;
  
  // Non-admins can only see published books
  const isPublished = req.user && req.user.role.name === 'ADMIN' ? undefined : true;

  const result = await bookService.getBooks({
    category,
    search,
    page,
    limit,
    isPublished
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, result, 'Books retrieved successfully')
  );
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await bookService.getBookById(id);

  // If book is not published and user is not admin, deny access
  if (!book.isPublished && (!req.user || req.user.role.name !== 'ADMIN')) {
    res.status(STATUS_CODES.FORBIDDEN).json(
      new ApiResponse(STATUS_CODES.FORBIDDEN, null, 'This book is not published yet')
    );
    return;
  }

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, { book }, 'Book details retrieved successfully')
  );
});

const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);

  res.status(STATUS_CODES.CREATED).json(
    new ApiResponse(STATUS_CODES.CREATED, { book }, 'Book created successfully')
  );
});

module.exports = {
  getBooks,
  getBookById,
  createBook
};

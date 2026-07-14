const Bookmark = require('../models/Bookmark');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

class BookmarkService {
  async addBookmark(userId, { book, chapter }) {
    // Validate book and chapter exist
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Book not found');
    }

    const chapterExists = await Chapter.findById(chapter);
    if (!chapterExists) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Chapter not found');
    }

    if (chapterExists.book.toString() !== book) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Chapter does not belong to the specified book');
    }

    // Check for duplicate bookmark
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      book,
      chapter
    });

    if (existingBookmark) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'Chapter is already bookmarked');
    }

    const bookmark = await Bookmark.create({
      user: userId,
      book,
      chapter
    });

    return bookmark;
  }

  async removeBookmark(bookmarkId, userId) {
    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Bookmark not found');
    }

    if (bookmark.user.toString() !== userId.toString()) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, 'You do not have permission to remove this bookmark');
    }

    await Bookmark.findByIdAndDelete(bookmarkId);
    return true;
  }

  async getBookmarks(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate('book', 'title author coverImage')
      .populate('chapter', 'title chapterNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalBookmarks = await Bookmark.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalBookmarks / limit);

    return {
      bookmarks,
      pagination: {
        total: totalBookmarks,
        limit: Number(limit),
        page: Number(page),
        totalPages
      }
    };
  }
}

module.exports = new BookmarkService();

const ReadingProgress = require('../models/ReadingProgress');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

class ReadingProgressService {
  async saveProgress(userId, { book, chapter, progressPercent = 0, lastReadPosition = 0 }) {
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

    // Update or create reading progress record
    const progress = await ReadingProgress.findOneAndUpdate(
      { user: userId, book: book },
      {
        chapter: chapter,
        progressPercent: Number(progressPercent),
        lastReadPosition: Number(lastReadPosition),
        lastReadAt: new Date()
      },
      { new: true, upsert: true }
    );

    return progress;
  }

  async getBookProgress(userId, bookId) {
    const progress = await ReadingProgress.findOne({ user: userId, book: bookId })
      .populate('chapter', 'title chapterNumber');
    return progress;
  }

  async getContinueReading(userId, { limit = 5 } = {}) {
    const progressList = await ReadingProgress.find({ user: userId })
      .populate('book', 'title author coverImage')
      .populate('chapter', 'title chapterNumber')
      .sort({ lastReadAt: -1 })
      .limit(Number(limit));

    return progressList;
  }
}

module.exports = new ReadingProgressService();

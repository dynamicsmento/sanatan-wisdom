const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

class BookService {
  async getBooks({ category, search, page = 1, limit = 10, isPublished = true }) {
    const query = {};

    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .populate('category')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      books,
      pagination: {
        total: totalBooks,
        limit: Number(limit),
        page: Number(page),
        totalPages
      }
    };
  }

  async getBookById(id) {
    const book = await Book.findById(id).populate('category');
    if (!book) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Book not found');
    }
    return book;
  }

  async getChaptersByBookId(bookId, { page = 1, limit = 50, isPublished = true } = {}) {
    // Verify book exists
    await this.getBookById(bookId);

    const query = { book: bookId };
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    const skip = (page - 1) * limit;

    const chapters = await Chapter.find(query)
      .select('-content') // exclude heavy content from listing
      .sort({ chapterNumber: 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalChapters = await Chapter.countDocuments(query);
    const totalPages = Math.ceil(totalChapters / limit);

    return {
      chapters,
      pagination: {
        total: totalChapters,
        limit: Number(limit),
        page: Number(page),
        totalPages
      }
    };
  }

  async getChapterById(chapterId) {
    const chapter = await Chapter.findById(chapterId).populate('book');
    if (!chapter) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Chapter not found');
    }
    return chapter;
  }

  // Admin Actions
  async createBook(bookData) {
    // Ensure category exists
    const categoryExists = await Category.findById(bookData.category);
    if (!categoryExists) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Category does not exist');
    }

    const book = await Book.create(bookData);
    return book;
  }

  async createChapter(chapterData) {
    // Ensure book exists
    await this.getBookById(chapterData.book);

    // Ensure chapter number is unique for this book
    const existingChapter = await Chapter.findOne({
      book: chapterData.book,
      chapterNumber: chapterData.chapterNumber
    });
    if (existingChapter) {
      throw new ApiError(STATUS_CODES.CONFLICT, `Chapter number ${chapterData.chapterNumber} already exists for this book`);
    }

    const chapter = await Chapter.create(chapterData);
    return chapter;
  }
}

module.exports = new BookService();

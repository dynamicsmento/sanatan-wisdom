const Note = require('../models/Note');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

class NoteService {
  async createNote(userId, { book, chapter, content, isPrivate }) {
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

    const note = await Note.create({
      user: userId,
      book,
      chapter,
      content,
      isPrivate
    });

    return note;
  }

  async getNotes(userId, { book, chapter, page = 1, limit = 10 } = {}) {
    const query = { user: userId };
    
    if (book) query.book = book;
    if (chapter) query.chapter = chapter;

    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .populate('book', 'title author')
      .populate('chapter', 'title chapterNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / limit);

    return {
      notes,
      pagination: {
        total: totalNotes,
        limit: Number(limit),
        page: Number(page),
        totalPages
      }
    };
  }

  async updateNote(noteId, userId, { content, isPrivate }) {
    const note = await Note.findById(noteId);
    if (!note) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Note not found');
    }

    if (note.user.toString() !== userId.toString()) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, 'You do not have permission to update this note');
    }

    if (content !== undefined) note.content = content;
    if (isPrivate !== undefined) note.isPrivate = isPrivate;

    await note.save();
    return note;
  }

  async deleteNote(noteId, userId) {
    const note = await Note.findById(noteId);
    if (!note) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, 'Note not found');
    }

    if (note.user.toString() !== userId.toString()) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, 'You do not have permission to delete this note');
    }

    await Note.findByIdAndDelete(noteId);
    return true;
  }
}

module.exports = new NoteService();

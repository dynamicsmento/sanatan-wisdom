const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Note = require('../models/Note');

class SearchService {
  async globalSearch(userId, queryText) {
    if (!queryText) {
      return { books: [], chapters: [], notes: [] };
    }

    const regex = new RegExp(queryText, 'i');

    // Search Books
    const books = await Book.find({
      isPublished: true,
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        { tags: { $in: [regex] } }
      ]
    }).limit(10);

    // Search Chapters (and populate book details)
    const chapters = await Chapter.find({
      isPublished: true,
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } }
      ]
    })
      .populate('book', 'title author')
      .limit(10);

    // Search Notes (Only current user's notes)
    let notes = [];
    if (userId) {
      notes = await Note.find({
        user: userId,
        content: { $regex: regex }
      })
        .populate('book', 'title')
        .populate('chapter', 'title chapterNumber')
        .limit(10);
    }

    return {
      books,
      chapters,
      notes
    };
  }
}

module.exports = new SearchService();

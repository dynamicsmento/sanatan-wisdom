const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    isPrivate: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);

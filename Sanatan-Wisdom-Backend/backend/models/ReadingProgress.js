const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema(
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
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastReadPosition: {
      type: Number,
      default: 0
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);

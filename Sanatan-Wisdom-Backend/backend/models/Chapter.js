const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true
    },
    chapterNumber: {
      type: Number,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    audioUrl: {
      type: String,
      default: ''
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

chapterSchema.index({ book: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);

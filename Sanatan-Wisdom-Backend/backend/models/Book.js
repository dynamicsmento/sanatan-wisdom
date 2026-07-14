const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    coverImage: {
      type: String,
      default: ''
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

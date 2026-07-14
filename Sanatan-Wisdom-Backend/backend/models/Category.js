const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    }
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});

module.exports = mongoose.model('Category', categorySchema);

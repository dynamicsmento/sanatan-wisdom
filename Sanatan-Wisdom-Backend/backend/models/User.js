const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    refreshToken: {
      type: String
    },
    profileImage: {
      type: String,
      default: ''
    },
    preferences: {
      theme: { type: String, default: 'dark' },
      fontSize: { type: String, default: 'medium' }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

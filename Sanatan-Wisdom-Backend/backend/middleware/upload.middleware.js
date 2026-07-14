const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');
const { STATUS_CODES } = require('../constants');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|pdf|mp3|wav/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError(STATUS_CODES.BAD_REQUEST, 'Error: Supported file types are Images, PDFs, and Audios!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;

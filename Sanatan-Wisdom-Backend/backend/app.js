const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRouter = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const ApiError = require('./utils/apiError');
const { STATUS_CODES } = require('./constants');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom Cookie Parser Middleware to keep dependencies minimal and strict
app.use((req, res, next) => {
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  req.cookies = cookies;
  next();
});

// Serve static uploads (future-ready)
app.use('/uploads', express.static('backend/uploads'));

// API Routes
app.use('/api', apiRouter);

// Root path fallback
app.get('/', (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Welcome to Sanatan Wisdom API'
  });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new ApiError(STATUS_CODES.NOT_FOUND, `Route not found - ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;

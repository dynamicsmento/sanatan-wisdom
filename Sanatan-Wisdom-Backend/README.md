# Sanatan Wisdom Backend

A production-ready, highly scalable REST API backend for the Sanatan Wisdom application. Built with Node.js, Express.js, and MongoDB. Serves endpoints for user authentication, books and chapters, note-taking, bookmarking, and progress tracking.

---

## Technical Stack

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Security:** Helmet, CORS
- **Authentication:** JWT (Access & Refresh tokens) & bcryptjs
- **Logging:** Morgan
- **Request Validation:** express-validator
- **Media Uploads:** Multer (future-ready)

---

## Directory Structure

```text
sanatan-wisdom-backend/
├── backend/
│   ├── config/          # MongoDB connection and database seed logic
│   ├── constants/       # Global constants (ROLES, STATUS_CODES)
│   ├── controllers/     # Route controller logic
│   ├── middleware/      # Authentication, authorization, file upload, & error middlewares
│   ├── models/          # Mongoose database models (User, Book, Chapter, Note, etc.)
│   ├── routes/          # REST API endpoints
│   ├── services/        # Business logic & Database queries
│   ├── uploads/         # Local file storage (Multer output)
│   ├── utils/           # Utility helpers (ApiError, ApiResponse, asyncHandler, JWT)
│   ├── validators/      # Payload schema validators (express-validator)
│   └── app.js           # Express app settings configuration
├── scratch/
│   └── test_endpoints.js # Programmatic endpoint verification test suite
├── .env.example         # Template for environment configuration
├── package.json         # Project manifests and scripts
└── README.md            # Document overview and guides
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### Installation

1. Clone or download the repository.
2. Open terminal and navigate to the project directory:
   ```bash
   cd sanatan-wisdom-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of the project using `.env.example` as a template:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sanatan-wisdom
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Running the Application

### Development Mode (with hot-reloading)
Runs the server with `nodemon`:
```bash
npm run dev
```

### Production Mode
Starts the server normally:
```bash
npm start
```

---

## API Overview

All API endpoints are prefixed with `/api`.

### 1. Authentication (`/api/auth`)
- `POST /signup` - Registers a new user (assigns `USER` role by default).
- `POST /login` - Log in, issues JWT access token & sets HTTPOnly refresh token cookie.
- `POST /logout` - Logs out, invalidates refresh token & clears cookies.
- `POST /refresh-token` - Requests a new access token using a valid refresh token.
- `GET /me` - Get profile of the logged-in user (Protected).

### 2. Books & Chapters (`/api/books`)
- `GET /` - List all published books (supports category filter, search query, and pagination).
- `POST /` - Create a book (Admin only).
- `GET /:id` - Get details of a specific book.
- `GET /:bookId/chapters` - List chapters of a book.
- `POST /chapters` - Create a chapter (Admin only).
- `GET /chapters/:id` - Fetch details & content of a chapter.

### 3. Notes (`/api/notes`) (All Protected)
- `POST /` - Create a private note.
- `GET /` - List the user's notes (optional book/chapter filter).
- `PUT /:id` - Update note content/privacy.
- `DELETE /:id` - Delete note.

### 4. Bookmarks (`/api/bookmarks`) (All Protected)
- `POST /` - Bookmark a book/chapter.
- `GET /` - Get user's bookmarks list.
- `DELETE /:id` - Remove bookmark.

### 5. Reading Progress (`/api/progress`) (All Protected)
- `POST /` - Update progress percentage and position.
- `GET /continue` - Retrieve recently read chapters ("Continue Reading").
- `GET /:bookId` - Retrieve reading progress for a book.

### 6. Profile (`/api/profile`) (Protected)
- `GET /` - Get full profile details along with dashboard metrics (counts of notes, bookmarks, read books).
- `PUT /` - Modify profile username, image, and preferences.

### 7. Search (`/api/search`) (Protected)
- `GET /?q=query` - Performs fuzzy search across books, chapters, and the user's private notes.

---

## Verification Testing

You can programmatically verify all routes by running:
```bash
node scratch/test_endpoints.js
```
Make sure MongoDB is running before executing tests. The script will automatically start the server, register a test user, log in, seed data, and assert operational successes.

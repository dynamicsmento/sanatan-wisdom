# Implementation Plan - Sanatan Wisdom Backend

This document outlines the detailed architecture, directory structure, database models, and API endpoints for the **Sanatan Wisdom Backend**. This project is a production-ready REST API built with Node.js, Express, and MongoDB, serving a separate React frontend.

---

## Technical Stack & Dependencies

The backend will strictly use the following technologies:
- **Runtime Environment:** Node.js (JavaScript, ES Modules or CommonJS; we will use standard CommonJS for widespread Node compatibility in Express backends)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) for access and refresh tokens, `bcryptjs` for secure password hashing
- **Security:** `helmet` for HTTP headers security, `cors` for Cross-Origin Resource Sharing
- **Validation:** `express-validator` for request validation middleware
- **File Uploads:** `multer` (configured and future-ready)
- **Logging & Monitoring:** `morgan` for HTTP request logging
- **Development Tooling:** `nodemon` for hot-reloading
- **Environment Management:** `dotenv` for configuration variables

---

## Directory Structure

All files will be created in `C:\Users\LENOVO\.gemini\antigravity\scratch\sanatan-wisdom-backend\`.

```
sanatan-wisdom-backend/
├── .env.example
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
├── config/
│   └── db.js
├── constants/
│   └── index.js
├── controllers/
│   ├── auth.controller.js
│   ├── book.controller.js
│   ├── chapter.controller.js
│   ├── note.controller.js
│   ├── bookmark.controller.js
│   ├── progress.controller.js
│   ├── profile.controller.js
│   └── search.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── upload.middleware.js
│   └── role.middleware.js
├── models/
│   ├── User.js
│   ├── Book.js
│   ├── Chapter.js
│   ├── Note.js
│   ├── Bookmark.js
│   ├── ReadingProgress.js
│   ├── Category.js
│   └── Role.js
├── routes/
│   ├── index.js
│   ├── auth.routes.js
│   ├── book.routes.js
│   ├── note.routes.js
│   ├── bookmark.routes.js
│   ├── progress.routes.js
│   ├── profile.routes.js
│   └── search.routes.js
├── services/
│   ├── auth.service.js
│   ├── book.service.js
│   ├── note.service.js
│   ├── bookmark.service.js
│   ├── progress.service.js
│   └── search.service.js
├── utils/
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   └── jwt.js
├── validators/
│   ├── auth.validator.js
│   ├── book.validator.js
│   ├── note.validator.js
│   ├── bookmark.validator.js
│   └── progress.validator.js
└── uploads/             (For temporary/future media storage)
```

---

## Database Schemas & Relationships

1. **Role**:
   - `name`: String (Unique, e.g., 'ADMIN', 'USER')
   - `description`: String

2. **User**:
   - `username`: String (Unique, Indexed)
   - `email`: String (Unique, Indexed)
   - `password`: String (Hashed)
   - `role`: ObjectId (Ref to Role) or String (for simplicity and scalability, we'll use a `role` ObjectId reference, defaulting to the 'USER' role object ID)
   - `refreshToken`: String (For refreshing sessions)
   - Timestamps

3. **Category**:
   - `name`: String (Unique)
   - `slug`: String (Unique, auto-generated from name)
   - `description`: String
   - `parentCategory`: ObjectId (Ref to Category, optional)

4. **Book**:
   - `title`: String (Indexed)
   - `description`: String
   - `author`: String (Indexed)
   - `coverImage`: String
   - `category`: ObjectId (Ref to Category, Indexed)
   - `tags`: [String]
   - `isPublished`: Boolean (Default: false)
   - Timestamps

5. **Chapter**:
   - `book`: ObjectId (Ref to Book, Indexed)
   - `chapterNumber`: Number (Indexed)
   - `title`: String
   - `content`: String (Markdown/HTML body)
   - `audioUrl`: String (Future-ready audio book support)
   - `isPublished`: Boolean (Default: false)
   - Timestamps
   - *Index:* Compound index on `{ book: 1, chapterNumber: 1 }` (Unique)

6. **Note**:
   - `user`: ObjectId (Ref to User, Indexed)
   - `book`: ObjectId (Ref to Book, Indexed)
   - `chapter`: ObjectId (Ref to Chapter, Indexed)
   - `content`: String
   - `isPrivate`: Boolean (Default: true)
   - Timestamps

7. **Bookmark**:
   - `user`: ObjectId (Ref to User, Indexed)
   - `book`: ObjectId (Ref to Book, Indexed)
   - `chapter`: ObjectId (Ref to Chapter, Indexed)
   - Timestamps
   - *Index:* Compound index on `{ user: 1, book: 1, chapter: 1 }` (Unique)

8. **ReadingProgress**:
   - `user`: ObjectId (Ref to User, Indexed)
   - `book`: ObjectId (Ref to Book, Indexed)
   - `chapter`: ObjectId (Ref to Chapter, Indexed)
   - `progressPercent`: Number (0 to 100)
   - `lastReadPosition`: Number (Scroll offset or character offset)
   - `lastReadAt`: Date (Default: Date.now)
   - Timestamps
   - *Index:* Compound index on `{ user: 1, book: 1 }`

---

## API Routes & Controller Endpoints

### 1. Authentication (`/api/auth`)
- `POST /signup` - Registers a new user. Assigns 'USER' role by default.
- `POST /login` - Log in, generate JWT Access Token (short-lived) and Refresh Token (long-lived, saved in cookie and DB).
- `POST /logout` - Invalidate Refresh Token, clear cookies.
- `POST /refresh-token` - Retrieve new Access Token using valid Refresh Token.
- `GET /me` - Get logged-in user details (Protected).

### 2. Books & Chapters (`/api/books`)
- `GET /` - Retrieve paginated lists of books. Supports filtering by category, search, and publication status.
- `GET /:id` - Get specific book details.
- `GET /:id/chapters` - List all chapters of a book (paginated/ordered).
- `GET /:id/chapters/:chapterId` - Get chapter details and text.

### 3. Notes (`/api/notes`) (All Protected)
- `POST /` - Create a note.
- `GET /` - List notes of the current user, optionally filtered by `book` or `chapter`.
- `PUT /:id` - Update a note (must be owner).
- `DELETE /:id` - Delete a note (must be owner).

### 4. Bookmarks (`/api/bookmarks`) (All Protected)
- `POST /` - Bookmark a book/chapter.
- `DELETE /:id` - Remove bookmark.
- `GET /` - List bookmarks of the current user.

### 5. Reading Progress (`/api/progress`) (All Protected)
- `POST /` - Save/update reading progress for a book and chapter.
- `GET /continue` - Retrieve the most recently read book/chapter progress (for "Continue Reading").
- `GET /:bookId` - Retrieve reading progress for a specific book.

### 6. Profile (`/api/profile`) (Protected)
- `GET /` - Get full user profile, including reading statistics.
- `PUT /` - Update user profile details (username, profile image URL, preferences).

### 7. Search (`/api/search`)
- `GET /` - Full-text search across books (title, author, tags) and chapters (title, content).

---

## Core Infrastructure

### Error Handling
A centralized error handler middleware in `middleware/error.middleware.js` will intercept all errors. We will implement:
- `ApiError` class extending the standard `Error` class to encapsulate HTTP status codes, customized messages, and stack traces.
- `asyncHandler` wrapper to eliminate `try-catch` boilerplate in controllers.
- Generic `404 Handler` for route-not-found issues.

### Consistent API Response Format
All controllers will return response using a standard utility:
```javascript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null
}

// Error
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [ ... ]
}
```

### Security Measures
- **Helmet:** Secure Express app headers.
- **CORS:** Controlled access from the separate React frontend.
- **Environment Variables:** Securely store database connections, token secrets, and port details.
- **JWT & HTTPOnly Cookies:** Access tokens sent via Authorization Header (Bearer), and Refresh tokens stored in secure, httpOnly cookies.

---

## Verification Plan

### Automated Verification
We will build a verification script `scratch/test_endpoints.js` to simulate database connections and run requests against:
- Authentication flow (signup, login, JWT issuance, profile retrieval)
- Book retrieval and chapter navigation
- Notes and bookmark management
- Reading progress persistence

### Manual Verification
We will start the dev server (`npm run dev`) and test the endpoints using a local client (like curl or postman) to ensure:
- Application starts on the configured PORT without issues.
- MongoDB connection is established.
- Helmet and CORS headers are correctly returned.
- Server doesn't crash on invalid JSON payloads or validation failures.

---

## Open Questions & Review
- **Roles Collection seeding:** We will seed the database with defaults ('ADMIN' and 'USER') upon start if they do not exist.
- **Refresh Token Storage:** Refresh tokens will be stored in the DB (on the User model) and sent to the client via `httpOnly` secure cookies.
- **Multer:** An upload directory and future-proof middleware will be provided so the frontend can upload profile avatars or audiobooks in the future.

Please review the plan. Once approved, I will begin implementing the codebase.

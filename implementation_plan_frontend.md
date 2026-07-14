# Implementation Plan - Sanatan Wisdom Frontend

We will build a peaceful, production-ready, mobile-first React frontend project named `sanatan-wisdom-frontend`. 

It will be initialized as a Vite SPA using React (JS), Tailwind CSS, Redux Toolkit, RTK Query, React Router DOM, and Axios.

## User Review Required

> [!IMPORTANT]
> - **Active Workspace Recommendation**: We will create the project at `C:\Users\LENOVO\.gemini\antigravity\scratch\sanatan-wisdom-frontend`. We recommend setting this subdirectory as your active workspace after initialization.
> - **Vite SPA Selection**: We are implementing a SPA via Vite to support `react-router-dom` and client-side routing, aligning with the requested folder structure and package layout.
> - **Theme Implementation**: We will integrate custom peaceful HSL/Hex color values (`#E67E22` primary, `#FF9933` secondary, `#FFF8E7` background, etc.) directly into the Tailwind config.

## Open Questions
- *None at this stage. The specifications are clear and detailed.*

---

## Proposed Changes

### Project Initialization & Setup

#### [NEW] [package.json](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/package.json)
Initialize standard dependencies:
- React & React DOM (latest)
- React Router DOM
- `@reduxjs/toolkit` & `react-redux`
- Axios
- Lucide React (for modern, peaceful icons)
- Tailwind CSS, PostCSS, Autoprefixer (for styling)

#### [NEW] [tailwind.config.js](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/tailwind.config.js)
Define the custom Sanatan-inspired color palette and design tokens:
- **Colors**:
  - `primary`: `#E67E22` (Saffron/Orange)
  - `secondary`: `#FF9933` (Deep Saffron)
  - `background`: `#FFF8E7` (Warm Cream/Alabaster)
  - `card`: `#FAF3E0` (Soft Sand/Cream)
  - `text`: `#3E2723` (Dark Brown/Wood)
  - `accent`: `#7B241C` (Deep Maroon/Sindoor)
- **Typography**: Custom Serif font config (e.g. Playfair Display / Cinzel) for titles, and Sans (e.g. Outfit / Inter) for readable body text.
- **Borders & Shadows**: Soft gold borders (`border-gold`) and rounded-xl configurations.

#### [NEW] [index.css](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/styles/index.css)
Inject Tailwind directives, global base styles, customs variables, Google fonts link, and custom gold-shadow classes.

---

### Routing & Layouts

#### [NEW] [routes](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/routes/index.jsx)
Set up navigation using `react-router-dom` `HashRouter` or `BrowserRouter`. Create `ProtectedRoute.jsx` to intercept unauthenticated users and redirect them to `/login`.

#### [NEW] [layouts](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/layouts/)
- `MainLayout.jsx`: Combines `Sidebar` (Desktop), `BottomNavigation` (Mobile), and a top headers/nav with user profile quick action. Responsive container for nested page views.
- `AuthLayout.jsx`: Centered premium glassmorphism card for login and sign up.

---

### Redux Toolkit & RTK Query Store

#### [NEW] [store](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/store/)
- `index.js`: Combines slices and API services.
- `slices`:
  - `authSlice.js`: JWT tokens (access & refresh), user data, authentication state.
  - `bookSlice.js`: Reading history, current book/chapter state, offline/cached book details.
  - `noteSlice.js`: Custom user notes state (CRUD).
  - `bookmarkSlice.js`: Bookmarked chapters/verses state.
  - `uiSlice.js`: Themes, font sizes, modal, sidebar, and toast notifications.

#### [NEW] [services](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/services/)
- `api.js`: Set up RTK Query `createApi` using custom Axios base query helper. Handles JWT refresh token flow on `401 Unauthorized` responses.
- `authApi.js`, `booksApi.js`, `chapterApi.js`, `notesApi.js`, `bookmarksApi.js`, `profileApi.js` endpoints linked to the main api service.

---

### Pages & User Experience

#### [NEW] [pages](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/pages/)
- `Home.jsx`: Saffron-tinged landing page with beautiful Daily Shloka translation, quick entry cards.
- `Login.jsx` & `Signup.jsx`: Form inputs, toggle visibility, credential state tracking.
- `Dashboard.jsx`: Stats, "Continue Reading" panel, and summaries.
- `Books.jsx`: Interactive list of major scriptures (Bhagavad Gita, Upanishads, etc.).
- `BookDetails.jsx`: List of chapters with progress bars.
- `ChapterReading.jsx`: Reading interface modeled after the clean nagendra-jsr108 page, including custom font sizes, light/dark reading mode, text alignments, sticky notes sidebar, bookmarks.
- `Notes.jsx`: Central notes hub to view, filter, edit or delete notes.
- `Bookmarks.jsx`: Lists all saved items.
- `Profile.jsx` & `Settings.jsx`: User preference settings.
- `NotFound.jsx`: Spiritual custom 404.

---

### Reusable UI Components

#### [NEW] [components](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/sanatan-wisdom-frontend/src/components/)
Create premium components with micro-animations:
- `Navbar` & `BottomNavigation`
- `Sidebar`
- `BookCard`: Image, progress bar, continue reading button, bookmark toggle.
- `Toast`, `Loader`, `Skeleton`, `Modal`
- `ReusableForms` & `Buttons` (Saffron hover states)
- `SearchBar` & `EmptyState`

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no compilation or bundling errors.
- Run `eslint` verification if configured.

### Manual Verification
- Launch the local Vite dev server via `npm run dev`.
- Verify the responsive design on all requested breakpoints (320px, 375px, 425px, 768px, 1024px, 1440px) using Chrome responsive simulator.
- Click through the navigation flow, test UI adjustments (font size, theme switcher), mock login/logout, and check state updating in the store.

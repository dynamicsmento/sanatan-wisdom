import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';
import bookReducer from '../features/books/bookSlice';
import noteReducer from '../features/notes/noteSlice';
import bookmarkReducer from '../features/bookmarks/bookmarkSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    books: bookReducer,
    notes: noteReducer,
    bookmarks: bookmarkReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

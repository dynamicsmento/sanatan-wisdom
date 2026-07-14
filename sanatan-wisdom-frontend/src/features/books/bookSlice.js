import { createSlice } from '@reduxjs/toolkit';

const getStoredProgress = () => {
  try {
    const progress = localStorage.getItem('readingProgress');
    return progress ? JSON.parse(progress) : {};
  } catch {
    return {};
  }
};

const initialState = {
  selectedBookId: null,
  selectedChapterId: null,
  readingProgress: getStoredProgress(), // Format: { bookId: { lastChapterId: 1, lastVerseId: 1, percentage: 10, updatedAt } }
  searchQuery: '',
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    selectBook(state, action) {
      state.selectedBookId = action.payload;
    },
    selectChapter(state, action) {
      state.selectedChapterId = action.payload;
    },
    updateProgress(state, action) {
      const { bookId, chapterId, verseId, percentage } = action.payload;
      if (!state.readingProgress[bookId]) {
        state.readingProgress[bookId] = {};
      }
      state.readingProgress[bookId] = {
        lastChapterId: chapterId,
        lastVerseId: verseId || 1,
        percentage: percentage || 0,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('readingProgress', JSON.stringify(state.readingProgress));
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    }
  },
});

export const { selectBook, selectChapter, updateProgress, setSearchQuery } = bookSlice.actions;

export default bookSlice.reducer;

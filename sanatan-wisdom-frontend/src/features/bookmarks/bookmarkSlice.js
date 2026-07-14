import { createSlice } from '@reduxjs/toolkit';

const getStoredBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem('bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getStoredBookmarks(), // Array of: { id, type: 'book'|'chapter'|'verse', bookId, bookTitle, chapterId, chapterTitle, verseId, label, addedAt }
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action) {
      const { type, bookId, chapterId, verseId } = action.payload;
      
      const index = state.items.findIndex(b => 
        b.type === type && 
        b.bookId === bookId && 
        b.chapterId === chapterId && 
        (type !== 'verse' || b.verseId === verseId)
      );
      
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          id: 'bookmark_' + Date.now() + Math.random().toString(36).substring(2, 9),
          addedAt: new Date().toISOString(),
          ...action.payload
        });
      }
      localStorage.setItem('bookmarks', JSON.stringify(state.items));
    },
    removeBookmarkById(state, action) {
      state.items = state.items.filter(b => b.id !== action.payload);
      localStorage.setItem('bookmarks', JSON.stringify(state.items));
    },
    setBookmarks(state, action) {
      state.items = action.payload;
      localStorage.setItem('bookmarks', JSON.stringify(state.items));
    }
  },
});

export const { toggleBookmark, removeBookmarkById, setBookmarks } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;

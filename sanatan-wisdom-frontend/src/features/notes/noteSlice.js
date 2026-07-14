import { createSlice } from '@reduxjs/toolkit';

const getStoredNotes = () => {
  try {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getStoredNotes(),
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote(state, action) {
      const newNote = {
        id: 'note_' + Date.now() + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookId: action.payload.bookId || '',
        bookTitle: action.payload.bookTitle || '',
        chapterId: action.payload.chapterId || '',
        chapterTitle: action.payload.chapterTitle || '',
        verseId: action.payload.verseId || null,
        title: action.payload.title,
        content: action.payload.content,
      };
      state.items.unshift(newNote);
      localStorage.setItem('notes', JSON.stringify(state.items));
    },
    updateNote(state, action) {
      const { id, title, content } = action.payload;
      const existingNote = state.items.find(n => n.id === id);
      if (existingNote) {
        existingNote.title = title;
        existingNote.content = content;
        existingNote.updatedAt = new Date().toISOString();
        localStorage.setItem('notes', JSON.stringify(state.items));
      }
    },
    deleteNote(state, action) {
      state.items = state.items.filter(n => n.id !== action.payload);
      localStorage.setItem('notes', JSON.stringify(state.items));
    },
    setNotes(state, action) {
      state.items = action.payload;
      localStorage.setItem('notes', JSON.stringify(state.items));
    }
  },
});

export const { addNote, updateNote, deleteNote, setNotes } = noteSlice.actions;

export default noteSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light', // 'light' | 'dark'
  fontSize: Number(localStorage.getItem('fontSize')) || 18, // reading font size in pixels (14-36)
  sidebarOpen: false,
  toasts: [], // array of toast objects: { id, type: 'success'|'error'|'info', message }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    setFontSize(state, action) {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', state.fontSize);
    },
    increaseFontSize(state) {
      if (state.fontSize < 36) {
        state.fontSize += 2;
        localStorage.setItem('fontSize', state.fontSize);
      }
    },
    decreaseFontSize(state) {
      if (state.fontSize > 14) {
        state.fontSize -= 2;
        localStorage.setItem('fontSize', state.fontSize);
      }
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    addToast(state, action) {
      state.toasts.push({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        type: action.payload.type || 'info', // 'success', 'error', 'info', 'warning'
        message: action.payload.message,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setFontSize,
  increaseFontSize,
  decreaseFontSize,
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;

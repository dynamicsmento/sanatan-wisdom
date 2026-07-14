import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      state.error = null;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    logOut(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { setCredentials, logOut, updateAccessToken, setAuthError, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

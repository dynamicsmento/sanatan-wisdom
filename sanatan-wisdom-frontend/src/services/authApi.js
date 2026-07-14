import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        data: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } = authApi;

import { api } from './api';

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        data: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;

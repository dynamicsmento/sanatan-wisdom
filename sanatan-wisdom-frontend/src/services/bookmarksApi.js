import { api } from './api';

export const bookmarksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query({
      query: () => ({
        url: '/bookmarks',
        method: 'GET',
      }),
      providesTags: ['Bookmarks'],
    }),
    addBookmark: builder.mutation({
      query: (bookmarkData) => ({
        url: '/bookmarks',
        method: 'POST',
        data: bookmarkData,
      }),
      invalidatesTags: ['Bookmarks'],
    }),
    removeBookmark: builder.mutation({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmarks'],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = bookmarksApi;

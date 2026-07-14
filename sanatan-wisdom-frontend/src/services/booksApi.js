import { api } from './api';

export const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => ({
        url: '/books',
        method: 'GET',
      }),
      providesTags: ['Books'],
    }),
    getBookById: builder.query({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
  }),
});

export const { useGetBooksQuery, useGetBookByIdQuery } = booksApi;

import { api } from './api';

export const notesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        method: 'GET',
      }),
      providesTags: ['Notes'],
    }),
    createNote: builder.mutation({
      query: (newNote) => ({
        url: '/notes',
        method: 'POST',
        data: newNote,
      }),
      invalidatesTags: ['Notes'],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...updatedNote }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        data: updatedNote,
      }),
      invalidatesTags: ['Notes'],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;

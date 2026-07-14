import { api } from './api';

export const chapterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChapterById: builder.query({
      query: ({ bookId, chapterId }) => ({
        url: `/books/${bookId}/chapters/${chapterId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { bookId, chapterId }) => [
        { type: 'Chapters', id: `${bookId}_${chapterId}` },
      ],
    }),
  }),
});

export const { useGetChapterByIdQuery } = chapterApi;

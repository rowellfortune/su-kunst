// src/store/api/notificationsApi.ts
import { createApi} from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { API } from 'aws-amplify'
import type { CommentType } from '@/types/comment';

type Args = { url: string; method: 'GET'|'POST'|'PUT'|'DELETE'; body?: any }

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> =
  async ({ url, method, body }) => {

    console.log(body);

    try {
      let data
      if (method === 'GET') {
        data = await API.get("comments", url, {});
      } else {
        data = await API.post('comments', url, { body })
        console.log(data)
      }
      return { data }
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status || 500,
          data: error.message || error,
        }
      }
    }
  }

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: amplifyBaseQuery,
  tagTypes: ['Post', 'Comment', 'User'],
  endpoints: builder => ({
    getComments: builder.query<CommentType[], void>({
      query: () => ({ url: '/comments', method: 'GET' }),
    }),
    addComment: builder.mutation<CommentType, Partial<CommentType>>({
      query: body => ({ url: '/comments', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
} = commentsApi;




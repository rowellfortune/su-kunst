// src/store/api/notificationsApi.ts
import { createApi} from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { API } from 'aws-amplify'
import type { CommentType } from '@/types/comment';

type Args = { url: string; method: 'GET'|'POST'|'PUT'|'DELETE'; body?: any }

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> =
  async ({ url, method, body }) => {

    try {
      let data
      if (method === 'GET') {
        data = await API.get("events", url, {});
      } else {
        data = await API.post('events', url, { body })
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

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: amplifyBaseQuery,
  tagTypes: ['Post', 'Comment', 'User'],
  endpoints: builder => ({
    getEvents: builder.query<CommentType[], void>({
      query: () => ({ url: '/events', method: 'GET' }),
    }),
    addPost: builder.mutation<CommentType, Partial<CommentType>>({
      query: body => ({ url: '/events', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetEventsQuery,
} = eventsApi;




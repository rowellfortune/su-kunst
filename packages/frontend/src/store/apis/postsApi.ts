// src/store/api/notificationsApi.ts
// import type { PostType } from '@/types/post';
import { createApi} from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { API } from 'aws-amplify'

// base for all items
interface BaseItem {
  pk?: string;            // primary key (optional)
  title: string;          // always required
  attachment?: string;    // URL to an image/video (optional)
  content?: string;       // body text (optional)
  description?: string;   // extra text (optional)
  author: string;         // who created it (required)
  postedBy?: string;      // user ID who posted it (optional)
  createdAt: number;     // UNIX timestamp (optional)
  type?: string;          // a generic “type” label (optional)
  link?: string;           // always required
  entityType:            // discriminant for narrowing
    | "POST"
    | "AD"
    | "OPPORTUNITY"
    | string;
}

interface PostType extends BaseItem {
  userId: any;
  entityType: "POST";
}

type Args = { url: string; method: 'GET'|'POST'|'PUT'|'DELETE'; body?: any }

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> =
  async ({ url, method, body }) => {
    try {
      let data
      if (method === 'GET') {
        data = await API.get("posts", url, {});
      } else {
        data = await API.post('posts', url, { body })
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

export const postsApi = createApi({
  reducerPath: 'postApi',
  baseQuery: amplifyBaseQuery,
  endpoints: builder => ({
    getPosts: builder.query<PostType[], void>({
      query: () => ({ url: '/posts', method: 'GET' }),
    }),
    addPost: builder.mutation<PostType, Partial<PostType>>({
      query: body => ({ url: '/posts', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetPostsQuery,
  useAddPostMutation,
} = postsApi;
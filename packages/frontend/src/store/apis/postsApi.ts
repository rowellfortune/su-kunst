import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { API } from 'aws-amplify';

interface BaseItem {
  pk?: string;
  title: string;
  attachment?: string;
  content?: string;
  description?: string;
  author: string;
  postedBy?: string;
  createdAt: number;
  type?: string;
  link?: string;
  entityType: "POST" | "AD" | "OPPORTUNITY" | string;
}

export interface PostType extends BaseItem {
  userId: any;
  entityType: "POST";
}

export interface PostsResponse {
  items: PostType[];
  nextCursor: string | null;
}

type Args = { url: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: any };

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> =
  async ({ url, method, body }) => {
    try {
      let data;
      if (method === 'GET') {
        data = await API.get("posts", url, {});
      } else {
        data = await API.post('posts', url, { body });
      }
      return { data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status || 500,
          data: error.message || error,
        },
      };
    }
  };

export const postsApi = createApi({
  reducerPath: 'postApi',
  baseQuery: amplifyBaseQuery,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, string | undefined>({
      query: (cursor) => {
        const params = new URLSearchParams({ limit: '20' });
        if (cursor) params.set('cursor', cursor);
        return { url: `/posts?${params}`, method: 'GET' };
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems, { arg }) => {
        if (!arg) {
          return newItems;
        }
        return {
          items: [...currentCache.items, ...newItems.items],
          nextCursor: newItems.nextCursor,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: ['Post'],
    }),
    addPost: builder.mutation<PostType, Partial<PostType>>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
} = postsApi;

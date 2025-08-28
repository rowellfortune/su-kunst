// src/store/apis/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { API } from 'aws-amplify';

export interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string; // e.g. "2 hrs"
  content: string;
  imageUrl?: string;
}

export interface ProfilePageProps {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  headline?: string;
  photos: string[];
  posts: Post[];
  createdAt: number;
  email: string;
  entityType: string;
  pk: string;
  profile: {
    bio: string;
    avatarFileattachment?: string;
    coverFileattachment?: string;
    website: string;
    location: string;
  };
  role: string;
  sk: string;
  username: string;
}

type Args = { url: string; method: 'GET' | 'POST'; body?: any };

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> = async ({
  url,
  method,
  body,
}) => {
  try {
    const data =
      method === 'GET'
        ? await API.get('users', url, {})
        : await API.post('users', url, { body });
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

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: amplifyBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // fetch a single user profile by id
    getUser: builder.query<ProfilePageProps, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    // update a user profile
    updateUser: builder.mutation <ProfilePageProps,{ userId: string; updates: Record<string, string> }>({
      query: ({ userId, updates }) => ({
        url: `/users/${userId}`,
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),
    // (optional) list all users
    listUsers: builder.query<ProfilePageProps[], void>({
      query: () => ({ url: `/users`, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ pk }) => ({ type: 'User' as const, id: pk })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

console.log(userApi);

export const {
  useGetUserQuery,
  useLazyListUsersQuery,
  useListUsersQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  usePrefetch
} = userApi;

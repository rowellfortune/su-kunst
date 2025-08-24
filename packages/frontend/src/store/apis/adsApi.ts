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

// an “AD” item
interface AdType extends BaseItem {
  entityType: "AD"; 
  company: string;
}

type Args = { url: string; method: 'GET'|'POST'|'PUT'|'DELETE'; body?: any }

export const amplifyBaseQuery: BaseQueryFn<Args, unknown, unknown> = async ({ url, method, body }) => {
  try {
    let data
    if (method === 'GET') {
      data = await API.get("ads", url, {});
    } else {
      data = await API.post('ads', url, { body })
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

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: amplifyBaseQuery,
  tagTypes: ['Post', 'Comment', 'User'],
  endpoints: builder => ({
    getAds: builder.query<AdType[], void>({
      query: () => ({ url: '/ads', method: 'GET' }),
    }),
    addPost: builder.mutation<AdType, Partial<AdType>>({
      query: body => ({ url: '/ads', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetAdsQuery,
} = adsApi;




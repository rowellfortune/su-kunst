import { configureStore } from '@reduxjs/toolkit'
import { postsApi } from '@/store/apis/postsApi'
import { commentsApi } from '@/store/apis/commentsApi'
import { adsApi } from '@/store/apis/adsApi'
import { opportunitiesApi } from '@/store/apis/opportunitiesApi'
import { eventsApi } from '@/store/apis/eventsApi'

// Aggregate all RTK Query API slices into an array
const apis = [
  postsApi,
  commentsApi,
  adsApi,
  opportunitiesApi,
  eventsApi,
]

export const store = configureStore({
  reducer: apis.reduce(
    (acc, api) => ({
      ...acc,
      [api.reducerPath]: api.reducer,
    }),
    {}
  ),
  middleware: (getDefault) =>
    getDefault().concat(...apis.map((api) => api.middleware)),
})

// Re-export hooks and endpoints from each API slice
export { useGetPostsQuery }     from '@/store/apis/postsApi'
export { useGetPostsQuery as useGetCommentsQuery }  from '@/store/apis/commentsApi'
export { useGetPostsQuery as useGetAdsQuery }       from '@/store/apis/adsApi'
export { useGetPostsQuery as useGetOpportunitiesQuery } from '@/store/apis/opportunitiesApi'
export { useGetPostsQuery as useGetEventsQuery }    from '@/store/apis/eventsApi'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

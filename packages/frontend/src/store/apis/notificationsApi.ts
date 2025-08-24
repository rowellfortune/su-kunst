// src/store/notificationsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { amplifyBaseQuery } from "../amplifyBaseQuery";

export type Notification = {
  entityType: "NOTIFICATION";
  read: boolean;
  updatedAt: number;
  createdAt: number;
  sk: string;
  message: string;
  postId?: string;
  pk: string;
  link?: string;
};

type GetNotificationsArgs = { cursor?: string };
type GetNotificationsResponse = { items: Notification[]; nextCursor?: string };

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  // 👇 Use Amplify
  baseQuery: amplifyBaseQuery({ apiName: "notifications" }),
  tagTypes: ["Notifications"],
  endpoints: (build) => ({
    // Infinite list with shared cache + merge (RTKQ pattern)
    getNotifications: build.query<GetNotificationsResponse, GetNotificationsArgs | void>({
      query: (args) => {
        const cursor = (args as GetNotificationsArgs | undefined)?.cursor;
        return cursor
          ? { url: "/notifications", method: "GET", init: { queryStringParameters: { cursor } } }
          : { url: "/notifications", method: "GET" };
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newCache) => {
        currentCache.items.push(...newCache.items);
        currentCache.nextCursor = newCache.nextCursor;
      },
      forceRefetch({ currentArg, previousArg }) {
        return (currentArg as GetNotificationsArgs | undefined)?.cursor !==
               (previousArg as GetNotificationsArgs | undefined)?.cursor;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((n) => ({ type: "Notifications" as const, id: n.sk })),
              { type: "Notifications" as const, id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    // Optimistic single mark-read
    markRead: build.mutation<{ sk: string }, { sk: string }>({
      query: ({ sk }) => ({
        url: `/notifications/${encodeURIComponent(sk)}/read`,
        method: "POST",
      }),
      async onQueryStarted({ sk }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            const item = draft.items.find((n) => n.sk === sk);
            if (item) item.read = true;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (_res, _err, { sk }) => [{ type: "Notifications", id: sk }],
    }),

    // Optimistic mark-all-read
    markAllRead: build.mutation<{ count: number }, void>({
      query: () => ({ url: `/notifications/read-all`, method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            draft.items.forEach((n) => (n.read = true));
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} = notificationsApi;

// src/store/amplifyBaseQuery.ts
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { Amplify, API } from "aws-amplify";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Req = { url: string; method?: HttpMethod; body?: any; init?: Record<string, any> };

function toSerializableError(err: any) {
  const status = err?.response?.status ?? err?.statusCode ?? err?.$metadata?.httpStatusCode ?? 500;
  return {
    status,
    data: {
      name: err?.name ?? "Error",
      message: err?.message ?? "Request failed",
    },
  };
}

export const amplifyBaseQuery =
  (options: { apiName: string }): BaseQueryFn<Req, unknown, { status: number; data: any }> =>
  async ({ url, method = "GET", body, init }) => {
    try {
      // Ensure Amplify is configured & API name exists
      const endpoints = Amplify.getConfig().API?.REST?.endpoints ?? [];
      const exists = endpoints.some((e: any) => e?.name === options.apiName);
      if (!exists) {
        return {
          error: {
            status: 500,
            data: {
              message: `Amplify REST API named "${options.apiName}" is not configured. Known: ${endpoints
                .map((e: any) => e?.name)
                .filter(Boolean)
                .join(", ") || "(none)"}`,
            },
          },
        };
      }

      const calls = {
        GET: (api: string, path: string, i?: any) => API.get(api, path, i),
        POST: (api: string, path: string, i?: any) => API.post(api, path, i),
        PUT: (api: string, path: string, i?: any) => API.put(api, path, i),
        PATCH: (api: string, path: string, i?: any) => API.patch(api, path, i),
        DELETE: (api: string, path: string, i?: any) => API.del(api, path, i),
      } as const;

      const fn = calls[method as HttpMethod];
      if (!fn) {
        return { error: { status: 400, data: { message: `Unsupported method: ${method}` } } };
      }

      const opts = method === "GET" ? init : { body, ...(init ?? {}) };
      const data = await fn(options.apiName, url, opts);
      return { data };
    } catch (err: any) {
      return { error: toSerializableError(err) };
    }
  };
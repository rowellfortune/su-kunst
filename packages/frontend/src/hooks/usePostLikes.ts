// hooks/usePostLikes.ts
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useAppContext } from "@/lib/contextLib";

/**
 * Custom hook to fetch and track like data for a given post.
 *
 * @param postId    The ID of the post to fetch likes for
 * @param apiName   The name of the Amplify REST API (from aws-exports)
 * @param basePath  The base URL path for your likes endpoints
 */
export function usePostLikes(
  postId: string,
  apiName = "reactions",     // must match the AWS_EXPORTS API name for your reactions endpoints
  basePath = "/reactions"    // the URL prefix you configured, e.g. GET /reactions/{postId}/likes
) {
  // ──────────────────────────────────────────────────────────────
  // 1️⃣ Local state for count, liked‑flag, and loading indicator
  // ──────────────────────────────────────────────────────────────
  const {isAuthenticated } = useAppContext();
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ──────────────────────────────────────────────────────────────
  // 2️⃣ useEffect: run once (or whenever postId changes) to fetch initial data
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;   // helps avoid state updates on unmounted component
    
    if (!isAuthenticated) return;

    // Compose the GET path: e.g. "/reactions/abc123/likes"
    const path = `${basePath}/${postId}/likes`;

    // Amplify’s API.get signature: API.get(apiName, path, init?)
    API.get(apiName, path, {})
      .then((response: { liked: boolean; count: number }) => {
        if (!isMounted) return;      // bail if the component unmounted
        setLiked(response.liked);     // did the current user already like?
        setCount(response.count);     // total number of likes on this post
      })
      .catch((err) => {
        console.error("usePostLikes GET error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // cleanup function: runs on unmount or before next effect
    return () => {
      isMounted = false;
    };
  }, [postId, apiName, basePath, isAuthenticated]);  // re-run if any of these change


  // ──────────────────────────────────────────────────────────────
  // 3️⃣ Return the data and setters
  //    - `setLiked` and `setCount` allow the caller to update state
  //      (e.g. immediately after a toggleLike POST succeeds)
  // ──────────────────────────────────────────────────────────────
  return { liked, count, loading, setLiked, setCount };
}

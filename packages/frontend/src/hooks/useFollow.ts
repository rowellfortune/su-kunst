// src/hooks/useFollow.ts
import { useState, useCallback } from "react";
import { API } from "aws-amplify";
import { ensureAuth } from "@/lib/authGuard";

type ToggleFollowResponse = {
  following: boolean;
  followerCount?: number;
  followingCount?: number; // (for the current user)
};

type UseFollowOpts = {
  targetId: string;            // user being followed/unfollowed
  initialFollowing?: boolean;  // initial state from server
  initialFollowerCount?: number;
};

const API_NAME = "users"; // <-- must match Amplify.configure({ API: { endpoints: [{ name: "api", ...}]}})

export function useFollow({
  targetId,
  initialFollowing = false,
  initialFollowerCount = 0,
}: UseFollowOpts) {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowing);
  const [followerCount, setFollowerCount] = useState<number>(initialFollowerCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(targetId)

  const toggleFollow = useCallback(async () => {
    setLoading(true);
    setError(null);

    // optimistic UI
    const prevFollowing = isFollowing;
    const prevFollowerCount = followerCount;
    setIsFollowing(!prevFollowing);
    setFollowerCount((c) => Math.max(0, c + (prevFollowing ? -1 : +1)));

    try {
      await ensureAuth(); // 👈 guard
      const res = (await API.post("users", `/users/${targetId}/follow/toggle`, {
        body: targetId, // backend doesn’t need a body; include if you log actor name server-side
      })) as ToggleFollowResponse;

      // trust server truth if provided
      if (typeof res.following === "boolean") setIsFollowing(res.following);
      if (typeof res.followerCount === "number") setFollowerCount(Math.max(0, res.followerCount));
    } catch (e: any) {
      // revert on error
      setIsFollowing(prevFollowing);
      setFollowerCount(prevFollowerCount);
      setError(e?.message ?? "Failed to toggle follow");
    } finally {
      setLoading(false);
    }
  }, [API_NAME, targetId, isFollowing, followerCount]);

  return { isFollowing, followerCount, loading, error, toggleFollow };
}

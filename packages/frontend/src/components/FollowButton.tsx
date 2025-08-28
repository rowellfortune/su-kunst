
import { useFollow } from "@/hooks/useFollow";

type Props = {
  targetId: string;
  initialFollowing?: boolean;
  initialFollowerCount?: number;
  className?: string;
};

export default function FollowButton({
  targetId,
  initialFollowing,
  initialFollowerCount,
  className,
}: Props) {
  const { isFollowing, followerCount, loading, error, toggleFollow } = useFollow({
    targetId,
    initialFollowing,
    initialFollowerCount,
  });

  return (
    <div className={className}>
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`px-3 py-2 rounded-2xl shadow-sm ${
          isFollowing ? "bg-blue-500 text-white" : "bg-black text-white"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? "…" : isFollowing ? "Following" : "Follow"}
      </button>

      <span className="ml-3 text-sm text-gray-600">
        {followerCount} follower{followerCount === 1 ? "" : "s"}
      </span>

      {error && (
        <div className="mt-1 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

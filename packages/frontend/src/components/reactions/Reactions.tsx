import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { API } from 'aws-amplify';
import { onError } from '@/lib/errorLib';

type ReactionsProps = {
  postId?: string;
  userId?: string;
};

function Reactions({ postId, userId }: ReactionsProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikes() {
      try {
        // const res = await API.get("posts", `/posts/${postId}/likes`, {});
        // setLikesCount(res.count);
        // setLiked(res.likedByCurrentUser);
      } catch (e) {
        onError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchLikes();
  }, [postId]);

  async function handleLike() {
    try {
      const res = await API.post("reactions", "/reactions", {
        body: { postId, userId },
      });

      setLiked(res.liked);
      setLikesCount((prev) => (res.liked ? prev + 1 : prev - 1));
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div
      className="flex items-center space-x-1 cursor-pointer select-none"
      onClick={handleLike}
    >
      <FaThumbsUp className={liked ? "text-blue-500 w-4 h-4" : "text-gray-400 w-4 h-4"} />
      <span className="text-sm text-gray-700">
        {loading ? "..." : `${likesCount} Like${likesCount === 1 ? "" : "s"}`}
      </span>
    </div>
  );
}

export default Reactions;

// components/Reactions.tsx
import { useContext, useState } from 'react';
import { API } from 'aws-amplify';
import { Heart, ScanHeart } from 'lucide-react';
import { usePostLikes } from '@/hooks/usePostLikes';
import { AppContext, useAppContext } from '@/lib/contextLib';

// interface ReactionsProps {
//   postId: string;
// }

export default function Reactions({ postId }: any) {
  // pull initial state & loader from our hook
  const {user} = useContext(AppContext)
  const {isAuthenticated } = useAppContext();
  const { liked, count, loading, setLiked, setCount } = usePostLikes(postId);

  console.log(usePostLikes(postId), 'Liked')
  // track only the toggle‑call loading
  const [toggling, setToggling] = useState(false);

  const toggleLike = async () => {
    if (toggling) return;
    setToggling(true);

    if (!isAuthenticated) return;

      try {
        
        const response = await API.post("reactions", `/reactions/${postId}/likes`, {
          body: {user}
        });
        // { liked: boolean, count: number }
        console.log(response, 'Repsonse From Post')
        setLiked(response.liked);
        setCount(response.count);
      } catch (error) {
        console.error("Error toggling like:", error);
      } finally {
        setToggling(false);
      }
   
  };

  const isBusy = loading || toggling;


  return (
    <button
      onClick={toggleLike}
      disabled={isBusy}
      className={`
        flex items-center space-x-1 text-sm
        ${liked ? "text-red-600" : "text-gray-600 hover:text-red-600"}
      `}
    >
      {isBusy
        ? <span className="animate-pulse"><ScanHeart size={16}/></span>
        : liked
          ? <Heart color='#ff0000' size={20}/>
          : <Heart  size={16}/>
      }
      
      <span className={`
        ${liked ? "text-#6fff00-600" : "text-gray-600 hover:text-red-600"}
      `}>{count}</span>
    </button>
  );
}

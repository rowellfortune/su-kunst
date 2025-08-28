// import { Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostType } from "@/types/post";
import Comment from "../reactions/Comments";
import { formatDistanceToNowStrict } from 'date-fns';
import { useAppContext } from "@/lib/contextLib";
import { useGetUserQuery } from '@/store/apis/userApi';  // <-- make sure this points to your RTK Query slice
import { Separator } from '../ui/separator';
import Reactions from '../reactions/Reactions';
import { Link } from 'react-router-dom';
import EditPost from "../reactions/EditPost";

function Post({ author = "", content, userId, attachment, pk, createdAt }: PostType) {

  const { isAuthenticated, user} = useAppContext();

  // console.log(user.attributes.sub)

  // 🔥 Pass userId here, not undefined
  const effectiveId = userId ?? "";
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !userId });

  // fallback to the passed‑in `author` if we don’t have the full profile yet
  const displayName = userInfo?.username ?? author;
  const avatarUrl   = userInfo?.profile.avatarFileattachment;


  console.log(effectiveId)
  console.log(userInfo?.pk)

  const getCurrentUser = (userId: string | undefined) => {
    return userId?.replace("USER#", "")
  }

  console.log(getCurrentUser(userInfo?.pk));
  const pretty = createdAt
    ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })
    : "";

  return (
    <>
     {isAuthenticated &&
      <div className="bg-white rounded-xl shadow-md overflow-hidden border mx-auto my-3">
        <div className="flex items-center m-4">
          <Link to={`/profile/${userId}`}>
            <Avatar className="h-12 w-12">
              {!userInfoError &&  !userInfoLoading ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : (
                <AvatarFallback>{displayName[0]}</AvatarFallback>
              )}
            </Avatar>
          </Link>
          <div className="ml-3">
            <Link to={`/profile/${userId}`}>
              <div className="text-md font-semibold text-gray-900">{displayName}</div>
            </Link>
            <div className="text-xs font-light text-gray-500">{pretty}</div>
          </div>
        </div>

        <div className="p-3 my-2 text-sm">{content}</div>
        {attachment && (
          <div className="px-3">
            <img
              className="rounded-m w-full"
              src={attachment}
              alt="Post attachment"
            />
          </div>
        )}

        <Separator className="my-4"/>
    
        <div className="flex justify-between items-center mx-3 pb-4 text-gray-600 text-sm">
          <div className="flex space-x-4">
            {isAuthenticated && <Reactions postId={pk} />}
            {isAuthenticated && <Comment author={displayName} pk={pk} userId={userId} postId={pk} />}
            {(isAuthenticated && userId === user.attributes.sub) ? <EditPost pk={pk} author={displayName} userId={userId}/> : null}
          </div>
        </div>
      </div>}
    </>
  );
}

export default Post;

import { Bookmark,
  //  Trash2 
  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PostType } from "@/types/post";
import Comment from "../reactions/Comments";
// import Reactions from "../reactions/Reactions";
import { formatDistanceToNowStrict } from 'date-fns';
import { 
  // AppContext, 
  useAppContext 
} from "@/lib/contextLib";
// import { 
//   useContext,
//   //  useEffect, useState 
//   } from "react";
// import  EditPost from '../reactions/EditPost';
import { Separator } from '../ui/separator';
import Reactions from '../reactions/Reactions';
import ShareCompnent from '../reactions/Share';

function Post({author, content, userId, attachment, pk, createdAt}: PostType) {
  console.log(createdAt)

  const {isAuthenticated } = useAppContext();

  // 2) Compute “time since” directly from the Date
  const pretty = createdAt
    ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })
    : '';

  return (
    <> 
      <div className="bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
        <div className="flex items-center m-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="ml-3 text-md font-semibold text-gray-900">{author}</div>
            <div className="ml-3 text-xs font-light text-gray-500">{pretty}</div>

          </div>
        </div>

        <div className="p-3 my-2 text-sm">{content}</div>
        <div className="px-3">
          <img
            className="rounded-m w-full"
            src={attachment} // Replace with dynamic source if needed
            alt={attachment}
          />
        </div>

        <Separator className="my-4 " />
        <div className="flex justify-between items-center mx-3 pb-4 text-gray-600 text-sm">
          <div className="flex space-x-0 justify-between">
            <div className="flex items-center">
              {isAuthenticated ? <Reactions postId={pk} /> : null}
            </div>
            <div className="flex items-center">
              {isAuthenticated ? <Comment author={author} pk={pk} userId={userId} postId={pk} /> : null}
            </div>
            <div className="flex items-center">
              <ShareCompnent />
            </div>
            {/* <div className="flex items-center">
              {user?.username === author ? <><EditPost author={author} title={''} pk={pk}/></> : null }
            </div>
            <div className="flex items-center">
              {user?.username === author ? <><Trash2 className="text-xl w-4 h-4 cursor-pointer"/></> : null }
            </div> */}
          </div>
          <Bookmark className="text-xl w-4 h-4 cursor-pointer"/>
        </div>
      </div>
    </>
  )
}

export default Post
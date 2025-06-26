
import { FiShare } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PostType } from "@/types/post";
import Comment from "../reactions/Comments";
import Reactions from "../reactions/Reactions";

function Post({user, title, content, userId, attachment, attachmentURL, pk}: PostType) {

  console.log(attachment, attachmentURL, user);
  
  return (
    <div className='my-3'>
      <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
        {/* User Info */}
        <div className="flex items-center p-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3 text-md font-semibold text-gray-900">{user}</div>
        </div>

        {/* Post Image */}
        <h5 className="px-3 text-bold text-2xl">{title}</h5>
        <div className="px-3 mb-2">{content}</div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center px-3 pb-4 text-gray-600 text-sm">
          <div className="flex space-x-4 justify-between">
            <div className="flex items-center space-x-1">
              <Reactions userId={userId} postId={pk} />
            </div>
            <div className="flex items-center space-x-1">
              <Comment user={user} pk={pk} userId={userId} postId={pk} />
            </div>
          </div>
          <FiShare className="text-xl cursor-pointer"/>
        </div>
      </div>
    </div>
  )
}

export default Post
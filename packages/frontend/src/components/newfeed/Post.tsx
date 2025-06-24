import React from 'react'
import {
  // Card,
//   CardAction,
  // CardContent,
//   CardDescription,
  // CardFooter,
  // CardHeader,
//   CardTitle,
} from "@/components/ui/card"
import { FaThumbsUp, FaComment } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Post(props: any) {
    console.log(props)
  return (
    <div>
<div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
      {/* User Info */}
      <div className="flex items-center p-4">
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-3 font-semibold text-gray-900">{props.user}</div>
      </div>

      {/* Post Image */}
        <img
            className="w-full object-cover"
            src="/mnt/data/Feed Thumbnail.png" // Replace with dynamic source if needed
            alt="Post"
        />

      {/* Likes Info */}
      <div className="px-4 pt-4 text-sm text-gray-700">
        <span className="font-semibold">rowell</span> and other
      </div>

      {/* Caption */}
      <div className="px-4 pt-2 pb-4 text-sm text-gray-800">
        <span className="font-semibold">Delving </span>
        psum, consectetur adipiscing elit. Phasellus sed consequat enim. Phasellus elemer... 
        <span className="text-gray-500">more</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 pb-4 text-gray-600 text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <FaThumbsUp className="text-blue-500" />
            <span>349 Likes</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment />
            <span>760 Comments</span>
          </div>
        </div>
        <FiShare className="text-xl cursor-pointer" />
      </div>
    </div>
    {/* <Card className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
        <CardHeader>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Created: {props.createdAt}            
        </CardHeader>
        <CardContent>
            <p>{props.title}</p>
            <p>{props.description}</p>
        </CardContent>
        <CardFooter>
            <div className="flex justify-between items-center pb-4 text-gray-600 text-sm">
                <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                    <FaThumbsUp className="text-blue-500" />
                    <span>349 Likes</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaComment />
                    <span>760 Comments</span>
                </div>
                </div>
                <FiShare className="text-xl cursor-pointer" />
            </div>
        </CardFooter>
    </Card> */}
    </div>
  )
}

export default Post
import { Bookmark,
  //  Trash2 
  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PostType } from "@/types/post";
import Comment from "../reactions/Comments";
// import Reactions from "../reactions/Reactions";
import { parse, formatDistanceToNowStrict } from "date-fns";
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
  // const [isLoading, setIsLoading] = useState(true);
  // const {user} = useContext(AppContext)
  const {isAuthenticated } = useAppContext();
  // const [username, setAuthor] = useState("");

  // useEffect(() => {


  //     setIsLoading(true);

  //     async function onLoad() {
  //       if (!isAuthenticated) {
  //         return;
  //       }
  //       setAuthor(user?.username);
  //       setIsLoading(false);
  //     }
  
  //     onLoad();
  //   }, [isAuthenticated, user]);

  function formatDate(str: undefined | number) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  const timeInDateFormat = formatDate(createdAt);
  const timeCreated = timeInDateFormat?.toLocaleString(); 

  const dt = parse(
    timeCreated!,
    "M/d/yyyy, h:mm:ss a",
    new Date()
  );

  const pretty = formatDistanceToNowStrict(dt, { addSuffix: true });

  return (
    <>
      {/* {isLoading ? 
      
        <>Loading.... </> 
      : */}
        <div className='mb-5'>
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
        </div>
      {/* }  */}
    </>
  )
}

export default Post
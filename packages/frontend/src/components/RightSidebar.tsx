import React, { useContext, useMemo } from "react";
import {
  // ScanEye,
   Users} from "lucide-react";
import {useGetPostsQuery, useGetUserQuery, useListUsersQuery} from "@/store";
import { AppContext, useAppContext } from "@/lib/contextLib";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const RightSidebar: React.FC = () => {
  const {isAuthenticated } = useAppContext();
  const {
    data: posts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useGetPostsQuery(undefined, { skip: !isAuthenticated });
  
  const { data: users, isLoading: usersAreLoading } = useListUsersQuery();

  console.log(users)

  const {user} = useContext(AppContext)
  const username = user?.username;
  const effectiveId = user.attributes.sub ?? "";
 
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });
  
  console.log(postsError)
  const avatarUrl   = userInfo?.profile.avatarFileattachment;
  
  console.log(userInfoLoading)
  console.log(userInfoError)

  const userPosts = useMemo(
    () => posts.filter((p) => p.author === username),
    [posts, username]
  );
  const postCount = userPosts.length;

  function RightPanel() {
    return (
      <aside className="w-80 p-6 hidden md:block space-y-8">
        <div className="bg-white rounded-xl p-4 text-center">
          <div
            className="h-24 rounded-t-xl bg-gradient-to-r from-pink-500 to-purple-500"
          />
            <Avatar className="-mt-12 mx-auto h-20 w-20 rounded-full border-4 border-purple-900 bg-white">
              <AvatarImage src={avatarUrl} alt="Jakob Botosh" />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
          <h3 className="mt-2 font-bold">{username}</h3>
          <p className="text-sm">@{username.toLowerCase()}</p>
          <p className="mt-2 text-xs">
            {userInfo?.profile?.bio ? <>{userInfo.profile?.bio}</> : <>[Your intro goes here]</>}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {/* <button className="px-4 py-1 bg-pink-500 rounded-full font-semibold hover:opacity-90">
              Follow
            </button> */}
            {/* <button className="px-4 py-1 border border-gray-600 rounded-full font-semibold hover:border-white">
              Message
            </button> */}
          </div>
          <div className="mt-4 flex justify-around text-xs ">
            <div>
              <p className="font-semibold text-xl">{postsLoading ? "…" : `${postCount}`}</p>
              <p className="text-md">Posts</p>
            </div>
            {/* <div>
              <p className="font-semibold text-white">2.8K</p>
              <p>Followers</p>
            </div>
            <div>
              <p className="font-semibold text-white">892</p>
              <p>Following</p>
            </div> */}
          </div>
          {/* <div className="mt-4 text-left text-xs text-gray-400 space-y-1">
            <p>📍 San Francisco, CA</p>
            <p>🌐 alexrivera.art</p>
            <p>🗓 Joined March 2022</p>
          </div> */}
          {/* <div className="mt-4 grid grid-cols-3 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-12 bg-gray-700 rounded-md" />
            ))}
          </div> */}
        </div>

        <div className="bg-white rounded-xl p-4">
           <h4 className="text-xl font-semibold mb-2 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Suggested Artists
          </h4>
          {!usersAreLoading ? 
          <ul className="space-y-3">
            {users?.map(({ username, role, pk, profile }) => (
              <li key={pk} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatarFileattachment} alt="Jakob Botosh" />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">{username}</p>
                    <p className="text-gray-400">{role}</p>
                    {/* <p className="text-gray-500">{followers} followers</p>  */}
                  </div>
                </div>
                <button className="bg-black rounded-md p-3">
                  {/* <ScanEye className="h-5 w-5 text-white" xlinkTitle="view" /> */}
                </button>
              </li>
            ))}
          </ul>: <>Loading users</> }
        </div>
      </aside>
    );
  }


  return (
    <>{RightPanel()}</>
  );
};

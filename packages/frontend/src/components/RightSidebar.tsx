import React, { useContext, useMemo } from "react";
import {Users} from "lucide-react";
import {useGetPostsQuery, useGetUserQuery, useListUsersQuery} from "@/store";
import { AppContext, useAppContext } from "@/lib/contextLib";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from 'react-router-dom';

export const RightSidebar: React.FC = () => {
  const {isAuthenticated } = useAppContext();
  const {
    data: posts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useGetPostsQuery(undefined, { skip: !isAuthenticated });
  
  const { data: users, isLoading: usersAreLoading } = useListUsersQuery();
  // console.log(users, 'Users')
  const {user} = useContext(AppContext)
  const username = user?.username;
  const effectiveId = user.attributes.sub ?? "";
 
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });
  
  const avatarUrl   = userInfo?.profile.avatarFileattachment;
  
  const userPosts = useMemo(
    () => posts.filter((p) => p.author === username),
    [posts, username]
  );
  const postCount = userPosts.length;

  function removeUserPrefix(id: string): string {
    return id.replace("USER#", "");
  }

  function RightPanel() {
    return (
      <aside className="xl:w-1/2 p-6 hidden md:block space-y-8 mx-auto">
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="h-24 rounded-t-xl bg-gradient-to-r from-pink-500 to-purple-500" />
            <Avatar className="-mt-12 mx-auto h-20 w-20 rounded-full border-4 border-purple-900 bg-white">
              <AvatarImage src={avatarUrl} alt="Jakob Botosh" />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            {!userInfoError && !userInfoLoading ? <h3 className="mt-2 font-bold">{username}</h3> : <>....</>}
            {/* <h3 className="mt-2 font-bold">{username}</h3> */}
            <p className="text-sm">@{username.toLowerCase()}</p>
            <p className="mt-2 text-xs">
              {userInfo?.profile?.bio ? <>{userInfo.profile?.bio}</> : <>[Tell us something about yourself]</>}
            </p>
            <div className="mt-4 flex justify-center space-x-2"></div>
            <div className="mt-4 flex justify-around text-xs ">
              <div>
                <p className="font-semibold text-xl">{postsLoading && postsError ? "…" : `${postCount}`}</p>
                <p className="text-md">Posts</p>
              </div>
              {/* <div>
                <p className="font-semibold text-xl">{postsLoading && postsError ? "…" : `${postCount}`}</p>
                <p className="text-md">Likes</p>
              </div>
              <div>
                <p className="font-semibold text-xl">{postsLoading && postsError ? "…" : `${postCount}`}</p>
                <p className="text-md">Followers</p>
              </div> */}
            </div>
          </div>
    
        <div className="bg-white rounded-xl p-4">
          <h4 className="text-xl font-semibold mb-2 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Suggested Artists
          </h4>
          {!usersAreLoading ? 
          <ul className="space-y-3">
            {users?.map(({ username, role, pk, profile }) => (
              <>{role != "admin" ? 
              <li key={pk} className="flex items-center justify-between">
                <Link to={`/profile/${removeUserPrefix(pk)}`}>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={profile?.avatarFileattachment} alt="Jakob Botosh" />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">{username}</p>
                    <p className="text-gray-400">{role}</p>
                  </div>
                </div>
                </Link>
              </li>
              : null}
              </>
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

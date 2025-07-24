import { useContext, useMemo, type FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { AppContext, useAppContext } from "@/lib/contextLib";
import { useGetPostsQuery, useGetUserQuery } from "@/store";

export const ProfileCard: FC = () => {
  const {isAuthenticated } = useAppContext();
  const {
    data: posts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useGetPostsQuery(undefined, { skip: !isAuthenticated });

  const {user} = useContext(AppContext)
  const username = user?.username;

    const effectiveId = user.attributes.sub ?? "";
    const {
      data: userInfo,
      error: userInfoError,
      isLoading: userInfoLoading,
    } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });
  
    console.log(userInfoError)
    console.log(userInfoLoading)
    // fallback to the passed‑in `author` if we don’t have the full profile yet
    // const displayName = userInfo?.username ?? author;
    const avatarUrl   = userInfo?.profile.avatarFileattachment;

  // memoize the filtered array & count
  const userPosts = useMemo(
    () => posts.filter((p) => p.author === username),
    [posts, username]
  );

  const postCount = userPosts.length;

  if (postsLoading) return <span>Loading…</span>;
  if (postsError) return <span>Error loading posts</span>;
  return (
    <Card className=" bg-white border-r hidden lg:block">
      {/* Header: avatar and name */}
      <CardContent className="flex items-center space-x-3 mx-auto">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt="Jakob Botosh" />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-semibold">{username}</span>
            <BadgeCheck className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-sm text-gray-500">@jakobbosh</span>
        </div>
      </CardContent>

      {/* Stats */}
      <CardContent className="mt-4 grid grid-cols-3 text-center">
        <div>
          <span className="block text-lg font-medium">2.3k</span>
          <span className="block text-xs text-gray-500">Follower</span>
        </div>
        <div>
          <span className="block text-lg font-medium">235</span>
          <span className="block text-xs text-gray-500">Following</span>
        </div>
        <div>
          <span className="block text-lg font-medium">{postsLoading ? "…" : `${postCount}`}</span>
          <span className="block text-xs text-gray-500">Posts</span>
        </div>
      </CardContent>
    </Card>
  );
};

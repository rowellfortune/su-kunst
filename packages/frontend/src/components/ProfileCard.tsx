import { useContext, type FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { AppContext } from "@/lib/contextLib";


export const ProfileCard: FC = () => {
    const {user} = useContext(AppContext)
    const username = user?.username;
  return (
    <Card className=" bg-white border-r hidden lg:block">
      {/* Header: avatar and name */}
      <CardContent className="flex items-center space-x-3 mx-auto">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/avatar.jpg" alt="Jakob Botosh" />
          <AvatarFallback>JD</AvatarFallback>
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
          <span className="block text-lg font-medium">80</span>
          <span className="block text-xs text-gray-500">Post</span>
        </div>
      </CardContent>
    </Card>
  );
};

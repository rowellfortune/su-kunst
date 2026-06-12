import React, { useContext, useMemo } from "react";
import { Search } from "lucide-react";
import { useGetPostsQuery, useGetUserQuery, useListUsersQuery, useGetAdsQuery } from "@/store";
import { AppContext, useAppContext } from "@/lib/contextLib";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

export const RightSidebar: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  const { data: ads = [], isLoading: adsLoading } = useGetAdsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: users, isLoading: usersAreLoading } = useListUsersQuery();
  const noneAdmin = users?.filter((item) => item.role.trim() !== "admin");

  const { user } = useContext(AppContext);

  function removeUserPrefix(id: string): string {
    return id.replace("USER#", "");
  }

  return (
    <div className="space-y-4">
      {/* Sponsored */}
      {!adsLoading && ads.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-gray-500 mb-3">Sponsored</h4>
          <div className="space-y-3">
            {ads.slice(0, 2).map((ad: any) => (
              <a
                key={ad.pk}
                href={ad.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {ad.attachment && (
                  <img
                    src={ad.attachment}
                    alt={ad.title}
                    className="w-[130px] h-[130px] object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 line-clamp-2">{ad.title}</p>
                  <p className="text-[12px] text-gray-500 truncate">{ad.company}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-300" />

      {/* Contacts / Artists */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[13px] font-semibold text-gray-500">Contacts</h4>
          <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <Search className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {!usersAreLoading ? (
          <ul className="space-y-0.5">
            {noneAdmin
              ?.filter((u) => removeUserPrefix(u.pk) !== user?.attributes?.sub)
              .slice(0, 12)
              .map(({ username, pk, profile }) => (
                <li key={pk}>
                  <Link
                    to={`/profile/${removeUserPrefix(pk)}`}
                    className="flex items-center gap-3 px-2 py-1.5 -mx-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatarFileattachment} alt={username} />
                        <AvatarFallback className="text-xs bg-gray-300">{username?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-900">{username}</span>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

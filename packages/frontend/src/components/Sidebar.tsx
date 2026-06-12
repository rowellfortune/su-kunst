import { type FC, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  User,
  Settings,
  Bookmark,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AppContext, useAppContext } from "@/lib/contextLib";
import { useGetUserQuery } from "@/store";

interface NavItem {
  label: string;
  icon: LucideIcon;
  url: string;
  iconColor: string;
}

const navItems: NavItem[] = [
  { url: "/", icon: Home, label: "Home", iconColor: "text-blue-500" },
  { url: "/events", icon: Calendar, label: "Events", iconColor: "text-red-500" },
  { url: "/marketplace", icon: Users, label: "Artists", iconColor: "text-cyan-500" },
  { url: "/saved", icon: Bookmark, label: "Saved", iconColor: "text-purple-500" },
  { url: "/settings/profile", icon: User, label: "Profile", iconColor: "text-green-500" },
  { url: "/settings", icon: Settings, label: "Settings", iconColor: "text-gray-500" },
];

export const Sidebar: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated } = useAppContext();
  const { user } = useContext(AppContext);
  const username = user?.username;
  const effectiveId = user?.attributes?.sub ?? "";

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });

  const avatarUrl = userInfo?.profile?.avatarFileattachment;

  return (
    <nav className="space-y-0.5">
      {/* User profile link */}
      <Link
        to={`/profile/${user?.attributes?.sub}`}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Avatar className="h-9 w-9">
          {!userInfoError && !userInfoLoading ? (
            <AvatarImage src={avatarUrl} alt={username} />
          ) : null}
          <AvatarFallback className="bg-gray-300 text-sm">{username?.[0]}</AvatarFallback>
        </Avatar>
        <span className="text-[15px] font-medium text-gray-900">{username}</span>
      </Link>

      {/* Nav items */}
      {navItems.map(({ label, icon: Icon, url, iconColor }) => {
        const isActive = currentPath === url;
        return (
          <Link
            key={label}
            to={url}
            className={`flex items-center gap-3 px-2 py-2 rounded-lg text-[15px] font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-900 hover:bg-gray-200"
            }`}
          >
            <div className={`flex items-center justify-center h-9 w-9 rounded-full ${isActive ? "bg-blue-100" : "bg-gray-100"}`}>
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : iconColor}`} />
            </div>
            <span>{label}</span>
          </Link>
        );
      })}

      {/* Divider */}
      <div className="border-t border-gray-300 my-2 mx-2" />

      {/* Footer */}
      <p className="px-4 py-2 text-xs text-gray-400">Su-Kunst &copy; 2025</p>
    </nav>
  );
};

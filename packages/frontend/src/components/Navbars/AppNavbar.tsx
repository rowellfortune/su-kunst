import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleLogout } from "@/lib/auth.ts";
import { AppContext, useAppContext } from "@/lib/contextLib.ts";
import { NotificationBell } from "@/components/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserQuery } from "@/store";
import { Home, Calendar, Store, Settings } from "lucide-react";

const centerNav = [
  { url: "/", icon: Home, label: "Home" },
  { url: "/events", icon: Calendar, label: "Events" },
  { url: "/marketplace", icon: Store, label: "Marketplace" },
  { url: "/settings", icon: Settings, label: "Settings" },
];

export default function Navbar() {
  const { userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AppContext);
  const username = user?.username;
  const { isAuthenticated } = useAppContext();

  const effectiveId = user.attributes.sub ?? "";
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });

  const avatarUrl = userInfo?.profile.avatarFileattachment;

  return (
    <nav className="flex items-center justify-between h-[56px] px-4 bg-white shadow-sm">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-2 w-[280px]">
        <Link to="/">
          <img src="/logo.png" alt="SuKunst Logo" className="h-10 w-10" />
        </Link>
      </div>

      {/* Center: Navigation icons */}
      <div className="hidden md:flex items-center justify-center flex-1 gap-1 max-w-[500px] mx-auto">
        {centerNav.map(({ url, icon: Icon, label }) => {
          const isActive = location.pathname === url;
          return (
            <Link
              key={url}
              to={url}
              className={`relative flex items-center justify-center h-[48px] px-8 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title={label}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-blue-500 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-1 w-[280px]">
        {isAuthenticated && <NotificationBell />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center rounded-full p-0.5 hover:bg-gray-100 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatarUrl} alt="User avatar" />
                {!userInfoError && userInfoLoading && (
                  <AvatarFallback className="text-sm bg-gray-200">{username?.[0]}</AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user?.attributes["custom:role"] === "admin" && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="w-full">Admin</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link to="/settings/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLogout(userHasAuthenticated, navigate)}
              className="text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

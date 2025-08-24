import { useContext} from 'react'
import {  Link, useNavigate } from "react-router-dom";
import { handleLogout } from "@/lib/auth.ts";
import { AppContext, useAppContext } from "@/lib/contextLib.ts";
import { NotificationBell } from "@/components/NotificationBell";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetUserQuery } from '@/store';

export default function Navbar() {
  const { userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const {user} = useContext(AppContext)
  const username = user?.username;
  const { isAuthenticated } = useAppContext();


    // 🔥 Pass userId here, not undefined
    const effectiveId = user.attributes.sub ?? "";
    const {
      data: userInfo,
      error: userInfoError,
      isLoading: userInfoLoading,
    } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });
  
    const avatarUrl   = userInfo?.profile.avatarFileattachment;
  
  return (
    <nav className="flex items-center justify-between px-6 py-4 mb-5 bg-white border-b">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <Link to={'/'}>
        <img src="/logo.png" alt="SuKunst Logo" className="h-12 w-12" />
        </Link>
        <Link to={'/'}>
         <span className="text-xl font-semibold hidden md:inline-block">Su-Kunst</span>
        </Link>
       
      </div>

      {/* Search */}
      {/* <div className="flex-1 px-6">
        <Input
          placeholder="Search"
          className="max-w-lg mx-auto bg-gray-100"
        />
      </div> */}

      {/* Actions */}
      <div className="flex items-center space-x-1">
          <NotificationBell />
        {/* <div className="">
          <Bookmark className="h-5 w-5" />
        </div> */}

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt="User avatar" />
                {!userInfoError && userInfoLoading &&   <AvatarFallback>{username?.[0]}</AvatarFallback> }
              </Avatar>
              <span className="text-sm hidden font-medium">{username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user?.attributes["custom:role"] === 'admin' ? <DropdownMenuItem><Link to="/admin">Admin</Link></DropdownMenuItem>: null  }
            <DropdownMenuItem><Link to="/settings/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem><button onClick={() => handleLogout(userHasAuthenticated, navigate)}>Logout</button></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>

  );
};

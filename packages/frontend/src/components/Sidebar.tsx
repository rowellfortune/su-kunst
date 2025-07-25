import { type FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "./ui/card";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Megaphone,
  //  Search, 
  //  Bell, 
  //  MessageCircle, 
  //  Bookmark, 
   User, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  badge?: number;
  url: string;
}

const navItems: NavItem[] = [
  { url: "/", label: "Home", icon: Home },
  { url: "/events", label: "Event", icon: Calendar },
  { url: "/sponsors", label: "Sponsors", icon: Megaphone },
  // {
  //   icon: Search, label: "Explore",
  //   url: ""
  // },
  // {
  //   icon: Bell, label: "Notifications",
  //   url: ""
  // },
  // {
  //   icon: MessageCircle, label: "Messages",
  //   url: ""
  // },
  // {
  //   icon: Bookmark, label: "Saved",
  //   url: ""
  // },
  {
    icon: User, label: "Profile",
    url: "/settings/profile"
  },
  {
    icon: Settings, label: "Settings",
    url: "/settings"
  },
];

export const Sidebar: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-80 p-6 hidden md:block space-y-8">
      {/* {Sidebar()} */}
      <Card className=" border-r hidden lg:block">
        <ScrollArea className="h-full p-4">
          <nav>
            <ul className="space-y-2">
              {navItems.map(({ label, icon: Icon, badge, url }) => {
                const isActive = currentPath === url;
                return (
                  <li key={label}>
                    <Link
                      to={url}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-6 w-6 mr-3 flex-shrink-0" />
                      <span className="flex-1 text-left">{label}</span>
                      {badge != null && (
                        <span
                          className={`ml-auto text-xs font-semibold rounded-full px-2 py-0.5 ${
                            isActive
                              ? "bg-white text-blue-500"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </ScrollArea>
      </Card>
    </aside>
  );
};

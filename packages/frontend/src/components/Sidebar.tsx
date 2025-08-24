import { type FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "./ui/card";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Megaphone,
  Bell, 
  MessageCircle, 
  Bookmark, 
  User, 
  Settings, 
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  badge?: number;
  url: string;
}

const navItems: NavItem[] = [
  { url: "/", icon: Home, label: "Home" },
  { url: "", icon: Users, label: "Friends"},
  { url: "/events", icon: Calendar, label: "Events", },
  { url: "", icon: Megaphone, label: "Sponsors" },
  { url: "", icon: Bell, label: "Notifications"},
  { url: "", icon: MessageCircle, label: "Messages"},
  { url: "", icon: Bookmark, label: "Saved"},
  { url: "/settings/profile", icon: User, label: "Profile"},
  { url: "/settings", icon: Settings, label: "Settings"},
];

export const Sidebar: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="md:w-full md:p-6 sm:px-6 md:block space-y-8">
      <Card className=" border-r py-0 md:py-1">
        <ScrollArea className="h-full p-4 mx-auto md:mx-px">
          <nav>
            <ul className="flex sm:flex-row space-x-2 space-y-0 overflow-x-auto md:flex-col md:space-x-0 text-center md:space-y-2">
              {navItems.map(({ label, icon: Icon, badge, url }) => {
                const isActive = currentPath === url;
                return (
                  <div key={label}>
                     {url !== "" ? 
                  <li>
                 
                    <Link
                      to={url}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-6 w-6 md:mr-3 flex-shrink-0 text-center" />
                      <span className="flex-1 md:text-left hidden md:block text-center">{label}</span>
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
                  : null }
                  </div>
                );
              })}
            </ul>
          </nav>
        </ScrollArea>
      </Card>
    </aside>
  );
};

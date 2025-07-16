import { type FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import {
  Home,
  // User,
  Calendar,
  // ShoppingCart,
  // Check,
} from "lucide-react";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  url: string;
}

// interface PageItem {
//   name: string;
//   icon: string; // path to icon
//   verified?: boolean;
// }

export const Sidebar: FC<{ activeItem?: string }> = ({ activeItem = "Feed" }) => {
  const navItems: NavItem[] = [
    { url: '/', label: "Feed", icon: Home },
    // { url: '/', label: "Friends", icon: User },
    { url: '/events', label: "Event", icon: Calendar, badge: 4 },
    // { url: '/marketplace', label: "Marketplace", icon: ShoppingCart },
  ];

  // const pagesYouLike: PageItem[] = [
  //   { name: "UI/UX Community", icon: "/icons/uix-community.svg" },
  //   { name: "Web Designer", icon: "/icons/web-designer.svg" },
  //   { name: "Dribbble Community", icon: "/icons/dribbble-community.svg" },
  //   { name: "Behance", icon: "/icons/behance.svg", verified: true },
  // ];

  return (
    <Card className="max-w-xs bg-white border-r hidden lg:block my-5">
      <ScrollArea className="h-full p-4">
        <nav>
          <ul className="space-y-2">
            {navItems.map(({ label, icon: Icon, badge, url }) => (
              <li key={label}>
                <Link to={url}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150
                    ${
                      activeItem === label
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge != null && (
                    <span
                      className={`ml-auto text-xs font-semibold rounded-full px-2 py-0.5
                        ${
                          activeItem === label
                            ? "bg-white text-blue-500"
                            : "bg-red-500 text-white"
                        }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <Separator className="my-4" /> */}
        {/* <div>
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-gray-500">
            Pages you like
          </h3>
          <ul className="space-y-2">
            {pagesYouLike.map(({ name, icon, verified }) => (
              <li key={name}>
                <a
                  href="#"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <img src={icon} alt={name} className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 truncate">{name}</span>
                  {verified && <Check className="h-4 w-4 text-blue-500 ml-2" />}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="block px-3 py-2 text-sm font-medium text-blue-500 hover:underline"
              >
                View All
              </a>
            </li>
          </ul>
        </div> */}
      </ScrollArea>
    </Card>
  );
};

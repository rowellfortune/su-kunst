import { 

  Inbox, 
  Megaphone, 
  ScanEye, 
  Building,
  Building2,
  User,
  Plane,
  Gauge
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  navMain: [
    {
      title: "Dashboard",
      icon: Gauge,
      isActive: true,
      items: [
        {
          title: "User",
          url: "/admin/user",
          icon: User,
        },
        {
          title: "Companies",
          url: "/admin/companies",
          icon: Building,
        },
        {
          title: "Ad Data",
          url: "/admin/ad-data",
          icon: Megaphone,
        },
        {
          title: "Opportunities",
          url: "/admin/opportunities",
          items: [
            {
              title: "Create new ads",
              url: "/admin/ads/new",
              icon: Megaphone,
            },
          ],
          icon: Plane,
        },
        {
          title: "Organizations",
          url: "/admin/organizations",
          icon: Building2,
        },
      ],
    },
    {
      title: "Ads",
      icon: ScanEye,
      items: [
        {
          title: "Create new ads",
          url: "/admin/ads/new",
           icon: Megaphone,
        },
        {
          title: "View all ads",
          url: "/admin/ads/",
           icon: Megaphone,
        },
        {
          title: "Live",
          url: "/admin/ads/live",
           icon: Megaphone,
        },
      ],
    },
    {
      title: "Opportunities",
      icon: Plane,
      items: [
        {
          title: "Create new Opportunities",
          url: "/admin/opportunities/new",
          icon: Megaphone,
        },
         {
          title: "View all Opportunities",
          url: "/admin/opportunities/new",
          icon: Megaphone,
        },
         {
          title: "Draft Opportunities",
          url: "/admin/opportunities/new",
          icon: Megaphone,
        },
      ],

    },
    {
      title: "Inbox",
      icon: Inbox,
      items: [
        {
          title: "Applications",
          url: "/admin/inbox",
          icon: Megaphone,
        },
        {
          title: "Request",
          url: "#",
           icon: Megaphone,
        },
        {
          title: "Incomming Calls",
          url: "#",
           icon: Megaphone,
        },
      ],
    },
  ],
}

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={data.navMain} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
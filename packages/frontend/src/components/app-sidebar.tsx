"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,

  Palette,
  Wrench,
  UserRoundCog,
  Settings
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "General",
          url: "/settings",
          icon: Settings2
        },
        {
          title: "Profile",
          url: "/settings/profile",
          icon: UserRoundCog
        },
        {
          title: "Account",
          url: "/settings/account",
          icon: Wrench
        },
        
        {
          title: "Appearance",
          url: "/settings/appearance",
          icon: Palette
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //   ],
    // },
    // {
    //   title: "Settings2",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //       icon: UserRoundCog
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

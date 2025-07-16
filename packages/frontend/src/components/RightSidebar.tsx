import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  // Edit2,
  // Search,
  // Filter,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useGetAdsQuery, useGetOpportunitiesQuery } from "@/store";
import { Card } from "./ui/card";

// interface MessageItem {
//   name: string;
//   avatar: string;
//   initials: string;
//   online: boolean;
// }

interface EventItem {
  title: string;
  subtitle?: string;
}

// const messages: MessageItem[] = [
//   { name: "Roger Korsgaard", avatar: "/avatars/roger.png", initials: "RK", online: true },
//   { name: "Terry Torff", avatar: "/avatars/terry.png", initials: "TT", online: true },
//   { name: "Angel Bergson", avatar: "/avatars/angel.png", initials: "AB", online: true },
//   { name: "Emerson Gouse", avatar: "/avatars/emerson.png", initials: "EG", online: true },
//   { name: "Corey Baptista", avatar: "/avatars/corey.png", initials: "CB", online: true },
//   { name: "Zain Culhane", avatar: "/avatars/zain.png", initials: "ZC", online: true },
//   { name: "Randy Lipshutz", avatar: "/avatars/randy.png", initials: "RL", online: true },
//   { name: "Craig Botosh", avatar: "/avatars/craig.png", initials: "CB", online: true },
// ];

const events: EventItem[] = [
  { title: "10 Events Invites" },
  { title: "Design System Collaboration", subtitle: "Thu – Harpoon Mall, YK" },
  { title: "Web Dev 2.0 Meetup", subtitle: "Yoshkar-Ola, Russia" },
  { title: "Prada's Invitation Birthday" },
];

export const RightSidebar: React.FC = () => {

    const {
      data: ads = [],
      // error: adsError,
      // isLoading: adsLoading,
    } = useGetAdsQuery()

  const {
    data: opportunities = [],
    // error: oppsError,
    // isLoading: oppsLoading,
  } = useGetOpportunitiesQuery()

  
    console.log(ads)
    console.log(opportunities)

  return (
    <Card className="w-80 bg-white border-l hidden xl:block">
      <ScrollArea className="h-full p-4 space-y-6">
        <div className="space-y-3">
          {ads.map((item) => (
            // <div>{item.company}</div>
            <li key={item.pk} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.attachment} alt={item.company} />
                  <AvatarFallback>{item.author}</AvatarFallback>
                </Avatar>
                {/* {item.type && (
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-white" />
                )} */}
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </li>
          ))}
        </div>

        {/* Messages Section */}
        {/* <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="ghost" className="p-1">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input placeholder="Search" className="h-8 pl-8 pr-10" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button variant="ghost" className="p-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="primary" className="mb-4">
            <TabsList>
              <TabsTrigger value="primary">Primary</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="requests">Requests(4)</TabsTrigger>
            </TabsList>
          </Tabs>

          <ul className="space-y-3">
            {messages.map((msg) => (
              <li key={msg.name} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} alt={msg.name} />
                    <AvatarFallback>{msg.initials}</AvatarFallback>
                  </Avatar>
                  {msg.online && (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{msg.name}</span>
              </li>
            ))}
          </ul>

          <a href="#" className="mt-4 block text-sm text-blue-500 hover:underline">
            View All
          </a>
        </section> */}

        {/* Events Section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Events</h2>
          <ul className="space-y-4 text-sm text-gray-700">
            {events.map((ev) => (
              <li key={ev.title} className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">{ev.title}</p>
                  {ev.subtitle && <p className="text-xs text-gray-500">{ev.subtitle}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </ScrollArea>
    </Card>
  );
};

import { type FC } from "react";
import {  CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Attendee {
  src?: string;
  fallback: string;
}

interface EventCardProps {
  imageSrc: string;
  datetime: string; // e.g. "Thu 10:00 AM"
  title: string;
  location: string;
  date: number; // day of month
  month: string; // e.g. "Aug"
  // attendees: Attendee[];
  // extraCount?: number;
}

export const EventsComponent: FC<EventCardProps> = ({
  imageSrc,
  datetime,
  title,
  location,
  date,
  month,
  // attendees,
  // extraCount,
}) => {

  console.log(location, date);
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden p-3">
      {/* Event image */}
      <img src={imageSrc} alt={title} className="w-full h-full rounded-xl  object-cover" />

      <CardContent>
        {/* Date & time row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium uppercase text-green-500">{datetime}</span>
          <div className="flex flex-col items-center bg-white border rounded-lg px-2 py-1">
            <span className="text-xs font-medium text-gray-500 uppercase">{month}</span>
          </div>
        </div>

        {/* Title and location */}
        <h3 className="text-lg font-semibold mb-1 text-left">{title}</h3>
      </CardContent>
    </div>
  );
};

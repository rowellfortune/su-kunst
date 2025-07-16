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
  return (
    <div className="max-w-sm bg-white rounded-xl shadow overflow-hidden p-3">
      {/* Event image */}
      <img src={imageSrc} alt={title} className="w-full h-full rounded-xl  object-cover" />

      <CardContent>
        {/* Date & time row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium uppercase text-green-500">{datetime}</span>
          <div className="flex flex-col items-center bg-white border rounded-lg px-2 py-1">
            <span className="text-xs font-medium text-gray-500 uppercase">{month}</span>
            <span className="text-lg font-bold leading-none">{date}</span>
          </div>
        </div>

        {/* Title and location */}
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">Location • {location}</p>

        {/* Attendees */}
        <div className="flex items-center">  
          <div className="flex -space-x-2">
            {/* {attendees?.slice(0, 3).map((att, idx) => (
              <Avatar
                key={idx}
                className="w-8 h-8 border-2 border-white"
              >
                {att?.src ? (
                  <AvatarImage src={att?.src} alt={att?.fallback} />
                ) : (
                  <AvatarFallback>{att?.fallback}</AvatarFallback>
                )}
              </Avatar>
            ))} */}
          </div>
          {/* {extraCount && (
            <div className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600 border-2 border-white">
              +{extraCount}
            </div>
          )} */}
        </div>
      </CardContent>
    </div>
  );
};

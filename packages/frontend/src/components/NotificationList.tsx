// src/components/NotificationList.tsx
import { type FC } from "react";
import type { Notification } from "../lib/notifications";
import {markAsRead} from '@/lib/notifications'

interface Props {
  notifications: Notification[];
  onMarkRead: (sk: string) => Promise<void>;
}

const NotificationList: FC<Props> = ({ notifications, onMarkRead }) => {
  if (notifications.length === 0) {
    return <div className="p-4 text-gray-500">No notifications</div>;
  }

  return (
    <ul>
      {notifications.map((n) => (
        <li
          key={n.sk}
          className={`flex items-start px-4 py-2 hover:bg-gray-50 ${
            n.read ? "opacity-70" : "bg-gray-100"
          }`}
        >
          <div className="flex-1">
            <a
              href={n.link || "#"}
              className="block text-sm text-gray-800"
              onClick={() => !n.read && onMarkRead(n.sk)}
            >
              {n.message}
            </a>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
          {!n.read && (
            <button
              onClick={() => markAsRead(n.sk)}
              className="ml-2 text-blue-500 text-xs"
            >
              Mark as read
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;

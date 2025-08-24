import { type FC, type MouseEvent } from "react";
import type { Notification } from "@/lib/notifications";

interface Props {
  notifications: Notification[];
  onMarkRead: (sk: string) => Promise<void>;
}

function formatRelativeTime(ts: number) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const delta = Math.floor((ts - Date.now()) / 1000); // negative for past
  const abs = Math.abs(delta);

  if (abs < 60) return rtf.format(Math.round(delta), "second");
  const mins = Math.round(delta / 60);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

const NotificationList: FC<Props> = ({ notifications, onMarkRead }) => {
  const readNotifications = notifications.filter(n => n.read === false);

  if (readNotifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        You’re all caught up 🎉
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {notifications.map((n) => {
        const isUnread = !n.read;
        const base = "flex items-start gap-3 px-4 py-3 hover:bg-gray-50";
        const unread = isUnread ? "bg-gray-50" : "";

        return (
          <li key={n.sk} className={`${base} ${unread}`}>
            {/* Unread dot */}
            <div className="mt-1">
              {isUnread ? (
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
              ) : (
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-transparent border border-gray-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Clickable message: mark read first, then navigate */}
              <a
                href={n.link || "#"}
                className={`block text-sm leading-5 ${
                  isUnread ? "font-medium text-gray-900" : "text-gray-800"
                }`}
                onClick={async (e: MouseEvent<HTMLAnchorElement>) => {
                  if (isUnread) await onMarkRead(n.sk);
                  // If no link or '#', prevent useless navigation
                  if (!n.link || n.link === "#") e.preventDefault();
                }}
              >
                {n.message}
              </a>

              <div className="mt-1 text-xs text-gray-500">
                <time dateTime={new Date(n.createdAt).toISOString()}>
                  {formatRelativeTime(n.createdAt)}
                </time>
              </div>
            </div>

            {/* “Mark read” action with bigger touch target */}
            {isUnread && (
              <button
                onClick={() => onMarkRead(n.sk)}
                className="shrink-0 ml-2 rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring"
                aria-label="Mark as read"
              >
                Mark as read
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NotificationList;

/**
 * Pure presentational list:
 * - Receives notifications + a single "onMarkRead" callback
 * - Renders items with accessible/touch-friendly actions
 * - No direct imports of API here (keeps concern separate)
 */

import { type FC, type MouseEvent } from "react";
import type { Notification } from "@/lib/notifications";

interface Props {
  notifications: Notification[];
  onMarkRead: (sk: string) => Promise<void>;
}

function formatRelativeTime(ts: number) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const deltaSeconds = Math.floor((ts - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);
  if (abs < 60) return rtf.format(Math.round(deltaSeconds), "second");
  const mins = Math.round(deltaSeconds / 60);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

const NotificationList: FC<Props> = ({ notifications, onMarkRead }) => {
  if (notifications.length === 0) {
    return <div className="p-6 text-center text-gray-500">You’re all caught up 🎉</div>;
  }

  return (
    <ul className="divide-y">
      {notifications.map((n) => {
        const isUnread = !n.read;
        return (
          <li
            key={n.sk}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 ${isUnread ? "bg-gray-50" : ""}`}
          >
            {/* Unread dot */}
            <div className="mt-1">
              {isUnread ? (
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
              ) : (
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-transparent border border-gray-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Click = mark read (optimistic) then navigate if there is a link */}
              <a
                href={n.link || "#"}
                className={`block text-sm leading-5 ${isUnread ? "font-medium text-gray-900" : "text-gray-800"}`}
                onClick={async (e: MouseEvent<HTMLAnchorElement>) => {
                  if (isUnread) await onMarkRead(n.sk);
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

            {/* Explicit "Mark as read" button (bigger touch target) */}
            {isUnread && (
              <button
                onClick={() => onMarkRead(n.sk)}
                className="shrink-0 ml-2 rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring"
                aria-label="Mark as read"
              >
                Mark
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NotificationList;

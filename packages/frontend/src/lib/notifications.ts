import { API } from "aws-amplify";

// src/lib/notifications.ts
export interface Notification {
  pk: string;
  sk: string;                  // e.g. "NOTIFICATION#162755..."
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

// Fetch latest notifications
export async function getNotifications(): Promise<Notification[]> {
  const res = await API.get("notifications", '/notifications', {});
  return res;
}

// Mark a single notification as read
export async function markAsRead(sk: string): Promise<void> {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/notifications/mark-read`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sk }),
    }
  );
  if (!res.ok) throw new Error("Failed to mark notification read");
}

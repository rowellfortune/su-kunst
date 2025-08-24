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
  console.log(res)
  return res;
}

// Mark a single notification as read
export async function markAsRead(sk: string): Promise<void> {
  const uuid = sk.replace("NOTIFICATION#", "");
  const res = await API.put("notifications", `/notifications/${uuid}/read`, {});
  console.log(res)
  return res;
}

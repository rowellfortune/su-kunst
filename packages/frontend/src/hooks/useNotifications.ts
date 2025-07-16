// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import { getNotifications, type Notification } from "@/lib/notifications";

export function useNotifications(pollIntervalMs = 60000) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const items = await getNotifications();
      setNotifications(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, pollIntervalMs);
    return () => clearInterval(id);
  }, [fetchAll, pollIntervalMs]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // const markOneAsRead = async (sk: string) => {
  //   await markAsRead(sk);
  //   setNotifications((prev) =>
  //     prev.map((n) => (n.sk === sk ? { ...n, read: true } : n))
  //   );
  // };

  return { notifications, loading, unreadCount};
}

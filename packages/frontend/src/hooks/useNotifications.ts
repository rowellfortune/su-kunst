// src/hooks/useNotifications.ts
/**
 * Auth-aware notifications hook:
 * - Skips polling when logged out
 * - Clears notifications on logout
 * - Optimistic "mark one" and "mark all"
 * - Optional browser notifications for new items
 */

import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markAsRead,
  type Notification as SuKunstNotification,
} from "@/lib/notifications";
import { useAppContext } from "@/lib/contextLib";
import { useBrowserNotification } from "./useBrowserNotification";

export interface UseNotificationsResult {
  notifications: SuKunstNotification[];
  loading: boolean;
  markOneReadOptimistic: (sk: string) => Promise<void>;
  markAllReadOptimistic: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications(pollIntervalMs = 60_000): UseNotificationsResult {
  const { isAuthenticated } = useAppContext();
  const [notifications, setNotifications] = useState<SuKunstNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef<SuKunstNotification[]>([]);
  const { askPermission, notify } = useBrowserNotification();
  const pollId = useRef<number | null>(null);

  const clearPoll = () => {
    if (pollId.current) {
      clearInterval(pollId.current);
      pollId.current = null;
    }
  };

  const fetchOnce = async () => {
    if (!isAuthenticated) {
      // If logged out: no fetch, show empty, not loading
      clearPoll();
      prevRef.current = [];
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await getNotifications();
      // Fire browser notifications for brand-new items
      const unseen = list.filter(n => !prevRef.current.some(old => old.sk === n.sk));
      unseen.forEach(n => {
        notify(n.message, {
          body: n.message,
          icon: "/logo.png",
          data: { url: `/notifications/${n.sk}` },
        });
      });
      prevRef.current = list;
      setNotifications(list);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Boot + react to auth changes
  useEffect(() => {
    askPermission().catch(() => {});
    // Start/stop polling based on auth
    fetchOnce();
    clearPoll();
    if (isAuthenticated) {
      pollId.current = window.setInterval(fetchOnce, pollIntervalMs) as unknown as number;
    }
    return clearPoll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pollIntervalMs]);

  // Optimistic: mark ONE
  async function markOneReadOptimistic(sk: string) {
    if (!isAuthenticated) return; // no-op if logged out
    setNotifications(prev => prev.map(n => (n.sk === sk ? { ...n, read: true } : n)));
    try {
      await markAsRead(sk);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      setNotifications(prev => prev.map(n => (n.sk === sk ? { ...n, read: false } : n)));
    }
  }

  // Optimistic: mark ALL
  async function markAllReadOptimistic() {
    if (!isAuthenticated) return;
    const snapshot = notifications;
    setNotifications(prev => prev.map(n => (n.read ? n : { ...n, read: true })));
    const unread = snapshot.filter(n => !n.read);
    const results = await Promise.allSettled(unread.map(n => markAsRead(n.sk)));
    const failed = results
      .map((r, i) => (r.status === "rejected" ? unread[i].sk : null))
      .filter(Boolean) as string[];
    if (failed.length) {
      setNotifications(prev => prev.map(n => (failed.includes(n.sk) ? { ...n, read: false } : n)));
    }
  }

  return { notifications, loading, markOneReadOptimistic, markAllReadOptimistic, refetch: fetchOnce };
}

// src/hooks/useNotifications.ts
import { useState, useEffect, useRef } from "react";
import { getNotifications, type Notification as SuKunstNotification } from "@/lib/notifications";
import { useBrowserNotification } from "./useBrowserNotification";

interface UseNotificationsResult {
  notifications: SuKunstNotification[];
  loading: boolean;
}

export function useNotifications(pollIntervalMs = 60000): UseNotificationsResult{
  const [notifications, setNotifications] = useState<SuKunstNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef<SuKunstNotification[]>([]);
  const { askPermission, notify } = useBrowserNotification();

  useEffect(() => {
    askPermission();
    // 1️⃣ Ask once on mount
    askPermission().then((p) => console.log("🔔 Permission:", p));

    // 2️⃣ Define our checker
    const checkForNew = async () => {
      setLoading(true);
      try {
        const response = await getNotifications();
        console.log("🔔 Raw API response:", response);

        // normalize to array
        const list: SuKunstNotification[] =
          Array.isArray(response)
            ? response
            : // if your API wraps in { Items: [...] }
            Array.isArray((response as any).Items)
            ? (response as any).Items
            : [];

        console.log("✅ Notifications list:", list);

        // diff against previous
        const unseen = list.filter(
          (n) => !prevRef.current.some((old) => old.sk === n.sk)
        );
        console.log("🚨 Unseen items:", unseen);

        // fire browser notifications
        unseen.forEach((n) => {
          console.log("🖥️  Firing notification:", n);
          notify(n.message , {
            body: n.message,
            icon: "/logo.png",
            data: { url: `/notifications/${n.sk}` },
          });
        });

        // update ref + state
        prevRef.current = list;
        setNotifications(list);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    checkForNew();
    const handle = setInterval(checkForNew, pollIntervalMs);
    return () => clearInterval(handle);
  }, [askPermission, notify, pollIntervalMs]);

  return { notifications, loading };
}

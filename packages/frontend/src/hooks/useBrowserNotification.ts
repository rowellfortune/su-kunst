// src/hooks/useBrowserNotification.ts

import { useCallback } from "react";

export function useBrowserNotification() {
  /**
   * Ask the user for notification permission.
   * Handles both old WebKit callback style and modern Promise style,
   * and no‑ops on devices where Notification API is unavailable.
   */
  const askPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("🔔 Notifications API not supported on this device");
      return "denied";
    }

    return new Promise<NotificationPermission>((resolve) => {
      // Old callback-based signature
      const callbackResult = Notification.requestPermission((permission) => {
        resolve(permission);
      });
      // New promise-based signature
      if (callbackResult && typeof (callbackResult as any).then === "function") {
        (callbackResult as Promise<NotificationPermission>).then(resolve);
      }
    });
  }, []);

  /**
   * Fire a browser notification if permission was already granted.
   */
  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(title, options);
      } catch (err) {
        console.error("🔔 Notification failed:", err);
      }
    }
  }, []);

  return { askPermission, notify };
}

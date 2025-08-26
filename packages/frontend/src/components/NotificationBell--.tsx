import { type FC, useEffect, useRef, useState, useCallback } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck, X } from "lucide-react";
import NotificationList from "@/components/NotificationList";
import { markAsRead } from "@/lib/notifications"; // assumed existing

export const NotificationBell: FC = () => {
  const { notifications, loading} = useNotifications(60_000);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close when clicking outside on desktop
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && buttonRef.current && !buttonRef.current.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Optimistic single-item mark-read
  const markOneAsRead = useCallback(async (sk: string) => {
    // Optimistic update
    const idx = notifications.findIndex(n => n.sk === sk);
    if (idx === -1 || notifications[idx].read) return;

    const prev = notifications[idx];
    notifications[idx].read = true; // optimistic
    try {
      await markAsRead(sk);
      // optionally refetch in background to keep in sync
      
    } catch (err) {
      // revert on failure
      notifications[idx] = prev;
      console.error("Failed to mark as read", err);
    }
  }, [notifications]);

  // Mark all as read (optimistic)
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter(n => !n.read);
    if (!unread.length) return;
    const prev = notifications.map(n => ({ ...n }));
    try {
      // optimistic flip
      for (const n of notifications) n.read = true;
      await Promise.all(unread.map(n => markAsRead(n.sk)));

    } catch (err) {
      // revert on failure
      prev.forEach((p, i) => (notifications[i] = p));
      console.error("Failed to mark all as read", err);
    }
  }, [notifications]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {open && (
        <>
          {/* Mobile sheet */}
          <div
            className="fixed inset-x-0 top-0 bottom-0 z-50 bg-white md:hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Notifications</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-gray-100"
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={16} />
                  Mark all
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading…</div>
              ) : (
                <NotificationList
                  notifications={notifications}
                  onMarkRead={async (sk) => {
                    await markOneAsRead(sk);
                    // Optional: close after navigating
                  }}
                />
              )}
            </div>
          </div>

          {/* Desktop dropdown */}
          <div
            ref={panelRef}
            className="hidden md:block absolute right-0 mt-2 w-[22rem] max-h-[70vh] overflow-hidden z-50"
          >
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="text-sm font-medium">Notifications</div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50"
                    disabled={unreadCount === 0}
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                    All
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading…</div>
                ) : (
                  <NotificationList
                    notifications={notifications}
                    onMarkRead={markOneAsRead}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

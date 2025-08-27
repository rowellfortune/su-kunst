// src/components/NotificationBell.tsx
import { type FC, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, X, LogIn } from "lucide-react";
import { useAppContext } from "@/lib/contextLib";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationList from "@/components/NotificationList";
import { useIsDesktop } from "@/hooks/useIsDesktop";

export const NotificationBell: FC = () => {
  const { isAuthenticated } = useAppContext();
  const { notifications, loading, markOneReadOptimistic, markAllReadOptimistic, refetch } =
    useNotifications(60_000);

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop(768); // md breakpoint
  const unreadCount = notifications.filter(n => !n.read).length;

  // ✅ ESC closes only on desktop
  useEffect(() => {
    if (!open || !isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isDesktop]);

  // ✅ Outside click closes only on desktop
  useEffect(() => {
    if (!open || !isDesktop) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, isDesktop]);

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
        {isAuthenticated && unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
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
            <Header
              isAuthenticated={isAuthenticated}
              unreadCount={unreadCount}
              onClose={() => setOpen(false)}
              onMarkAll={markAllReadOptimistic}
              onRefresh={refetch}
            />

            <div className="flex-1 overflow-y-auto">
              {!isAuthenticated ? (
                <LoggedOutSplash />
              ) : loading ? (
                <div className="p-4 text-center text-gray-500">Loading…</div>
              ) : (
                <NotificationList notifications={notifications} onMarkRead={markOneReadOptimistic} />
              )}
            </div>
          </div>

          {/* Desktop dropdown */}
          <div ref={panelRef} className="hidden md:block absolute right-0 mt-2 w-[22rem] max-h-[70vh] overflow-hidden z-50">
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="text-sm font-medium">Notifications</div>
                <div className="flex items-center gap-1">
                  {isAuthenticated && (
                    <>
                      <button onClick={() => refetch()} className="rounded-md px-2 py-1 text-xs hover:bg-gray-100">
                        Refresh
                      </button>
                      <button
                        onClick={markAllReadOptimistic}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50"
                        disabled={unreadCount === 0}
                        title="Mark all as read"
                      >
                        <CheckCheck size={14} /> All
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {!isAuthenticated ? (
                  <LoggedOutSplash compact />
                ) : loading ? (
                  <div className="p-4 text-center text-gray-500">Loading…</div>
                ) : (
                  <NotificationList notifications={notifications} onMarkRead={markOneReadOptimistic} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function Header({
  isAuthenticated,
  unreadCount,
  onClose,
  onMarkAll,
  onRefresh

}: {
  isAuthenticated: boolean;
  unreadCount: number;
  onClose: () => void;
  onRefresh: () => void;
  onMarkAll: () => void;
}) {
  return (
    <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b">
      <div className="font-semibold text-lg">Notifications</div>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <> 
          <button onClick={onRefresh} className="rounded-md px-2 py-1 text-xs hover:bg-gray-100">
            Refresh
          </button>
          <button
            onClick={onMarkAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            Mark all
          </button>
          </>
        ) : null}
        <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function LoggedOutSplash({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${compact ? "p-4" : "p-8"} text-center`}>
      <div>
        <div className="flex justify-center mb-2">
          <LogIn size={28} />
        </div>
        <div className="text-sm text-gray-700 font-medium">Sign in to view notifications</div>
        <div className="text-xs text-gray-500 mt-1">Your account is required to fetch and update notifications.</div>
        {/* Wire this button to your auth flow */}
        {/* <button className="mt-3 text-xs rounded px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700">Sign in</button> */}
      </div>
    </div>
  );
}

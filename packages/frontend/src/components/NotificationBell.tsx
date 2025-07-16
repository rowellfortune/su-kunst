// src/components/NotificationBell.tsx
import { type FC, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react"; // or your icon library
import NotificationList from "@/components/NotificationList";

export const NotificationBell: FC = () => {
  const { notifications, loading, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  function markOneAsRead(sk: string): Promise<void> {
    console.log(sk)
    throw new Error("Function not implemented.");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="z-50 absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading…</div>
          ) : (
            <NotificationList
              notifications={notifications}
              onMarkRead={markOneAsRead}
            />
          )}
        </div>
      )}
    </div>
  );
};

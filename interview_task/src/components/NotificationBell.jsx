
import { useNotifications } from "../contax/NotificationContext";
import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const { notifications, setNotifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showDropdown, setShowDropdown] = useState(false);

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notifications/read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking notifications as read", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative focus:outline-none"
      >
        <Bell className="w-7 h-7 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-50">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No new notifications</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {notifications.map((notif, index) => (
                <p
                  key={index}
                  className={`p-2 rounded-md text-sm ${notif.read ? "text-gray-500" : "text-black font-semibold"}`}
                >
                  {notif.message}
                </p>
              ))}
            </div>
          )}
          {notifications.length > 0 && (
            <button
              onClick={markAsRead}
              className="mt-2 w-full text-sm text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

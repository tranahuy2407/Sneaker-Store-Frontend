import { Bell, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import notificationAPI from "@/api/notification.api";
import { socket, joinAdminRoom } from "@/services/socket";
import { useNavigate } from "react-router-dom";

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    const res = await notificationAPI.getAdminUnreadCount();
    setUnreadCount(res.data.count);
  };

  const fetchNotifications = async () => {
    const res = await notificationAPI.getAdminNotifications({
      page: 1,
      limit: 10,
    });
    setNotifications(res.data.data);
  };

useEffect(() => {
  fetchUnreadCount();
  joinAdminRoom();

  const handler = (payload) => {
    fetchUnreadCount();
    fetchNotifications();
    if (payload?.type === "order_cancelled") {
      toast.warning(
        `Đơn ${payload.orderCode} đã bị huỷ`,
        {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        }
      );
      return;
    }

    toast.info(
      payload?.title || "Có thông báo mới cho Admin",
      { 
        icon: <Bell className="w-5 h-5 text-yellow-500" />,
      }
    );
  };

  socket.on("admin_notification", handler);

  return () => {
    socket.off("admin_notification", handler);
  };
}, []);


  /* CLICK OUTSIDE */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen((prev) => !prev);
    await fetchNotifications();
  };

  const markAsRead = async (notification) => {
    if (!notification?.id) return;

    await notificationAPI.markAdminAsRead(notification.id);

    fetchNotifications();
    fetchUnreadCount();

    if (notification.entity_type === "order" && notification.entity_id) {
      navigate(`/admin/orders/${notification.entity_id}`);
      setOpen(false);
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 bg-white border rounded-lg shadow-lg w-96">
          <div className="px-4 py-3 font-semibold border-b">
            Thông báo
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                Không có thông báo
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    !n.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="font-medium text-gray-800">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

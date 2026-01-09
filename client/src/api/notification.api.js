import { apiClient } from "../services/apiClient";

export const notificationAPI = {
  /* ================= USER ================= */

  //  Danh sách notification của user
  getMyNotifications: (params) =>
    apiClient.get("/notifications/my", { params }),

  //  Badge unread
  getMyUnreadCount: () =>
    apiClient.get("/notifications/my/unread-count"),

  //  Đánh dấu 1 notification đã đọc
  markAsRead: (id) =>
    apiClient.patch(`/notifications/my/read/${id}`),

  //  Đánh dấu tất cả đã đọc
  markAllAsRead: () =>
    apiClient.patch("/notifications/my/read-all"),

  /* ================= ADMIN ================= */

  //  Danh sách notification admin
  getAdminNotifications: (params) =>
    apiClient.get("/notifications/admin", { params }),

  //  Badge unread admin
  getAdminUnreadCount: () =>
    apiClient.get("/notifications/admin/unread-count"),

  // Admin đọc 1 notification
  markAdminAsRead: (id) =>
    apiClient.patch(`/notifications/admin/read/${id}`),

  // Admin đọc tất cả
  markAllAdminAsRead: () =>
    apiClient.patch("/notifications/admin/read-all"),
};

export default notificationAPI;

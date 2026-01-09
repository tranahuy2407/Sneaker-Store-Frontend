import { apiClient } from "../services/apiClient";

export const orderAPI = {
  create: (data) => {
    return apiClient.post("/orders", data); 
  },

  cancel: (orderId, reason) => {
    return apiClient.put(`/orders/${orderId}/cancel`, { reason });
  },

  getMyOrders: (params) => {
    return apiClient.get("/orders/me", { params });
  },

  getMyOrderDetail: (id) => {
    return apiClient.get(`/orders/me/${id}`);
  },

  getAll: (params) =>
    apiClient.get("/admin/orders", { params }),

  getDetail: (id) =>
    apiClient.get(`/admin/orders/${id}`),

  updateStatus: (id, status) =>
    apiClient.put(`/admin/orders/${id}/status`, { status }),
};

export default orderAPI;

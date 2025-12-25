import { apiClient } from "../services/apiClient";

export const orderAPI = {
  create: (data) => {
    return apiClient.post("/orders", data); 
  },

  cancel: (orderId, reason) => {
    return apiClient.put(`/orders/${orderId}/cancel`, { reason });
  },
};

export default orderAPI;

import { apiClient } from "../services/apiClient";

export const warehouseHistoryAPI = {
  getAll: (params) => apiClient.get("/warehouse-histories", { params }),
  getById: (id) => apiClient.get(`/warehouse-histories/${id}`),

  create: (data) => {
    return apiClient.post("/warehouse-histories", data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  update: (id, data) => {
    return apiClient.put(`/warehouse-histories/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  delete: (id) => apiClient.delete(`/warehouse-histories/${id}`),
};

export default warehouseHistoryAPI;

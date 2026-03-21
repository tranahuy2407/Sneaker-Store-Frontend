import { apiClient } from "../services/apiClient";

const contactAPI = {
  // Public
  create: (data) => apiClient.post("/contacts", data),

  // Admin
  getAll: () => apiClient.get("/admin/contacts"),
  getById: (id) => apiClient.get(`/admin/contacts/${id}`),
  updateStatus: (id, status) =>
    apiClient.patch(`/admin/contacts/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/admin/contacts/${id}`),
};

export default contactAPI;

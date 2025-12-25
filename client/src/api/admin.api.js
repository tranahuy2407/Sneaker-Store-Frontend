import { apiClient } from "../services/apiClient";

export const adminAPI = {
  register: (data) => apiClient.post("/admin/register", data),
  login: (credentials) => apiClient.post("/admin/login", credentials),
  logout: () => apiClient.post("/admin/logout"),
  getProfile: () => apiClient.get("/admin/profile"),
  refreshToken: () => apiClient.post("/admin/refresh-token"),
  getById: (id) => apiClient.get(`/admin/id/${id}`),
};

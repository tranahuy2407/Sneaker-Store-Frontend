import { apiClient } from "../services/apiClient";

export const userAPI = {
  register: (data) => apiClient.post("/user/register", data),
  login: (credentials) => apiClient.post("/user/login", credentials),
  logout: () => apiClient.post("/user/logout"),
  getProfile: () => apiClient.get("/user/profile"),
  updateProfile: (data) => apiClient.put("/user/profile", data),
  addAddress: (data) => apiClient.post("/user/address", data),
  refreshToken: () => apiClient.post("/user/refresh-token"),

  getAllUsers: () => apiClient.get("/admin/users"),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id, data) =>
    apiClient.put(`/api/v1/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  getUserStats: () => apiClient.get("/admin/users/stats"),
};
export default userAPI;
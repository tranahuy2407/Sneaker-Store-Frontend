import { apiClient } from "../services/apiClient";

export const userAPI = {
  register: (data) => apiClient.post("/user/register", data),
  login: (credentials) => apiClient.post("/user/login", credentials),
  logout: () => apiClient.post("/user/logout"),
  getProfile: () => apiClient.get("/user/profile"),
  updateProfile: (data) => apiClient.put("/user/profile", data),
  addAddress: (data) => apiClient.post("/user/address", data),
  refreshToken: () => apiClient.post("/user/refresh-token"),
  forgotPassword: (email) =>
    apiClient.post("/user/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    apiClient.post("/user/reset-password", {
      token,
      newPassword,
    }),
  googleLogin: (idToken) =>
    apiClient.post("/user/google-login", { idToken }),
  getAllUsers: () => apiClient.get("/admin/users"),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id, data) =>
    apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  getUserStats: () => apiClient.get("/admin/users/stats"),
  getLoyaltyStatus: () => apiClient.get("/user/loyalty/status"),
  claimLoyaltyGift: (data) => apiClient.post("/user/loyalty/claim", data),
};
export default userAPI;
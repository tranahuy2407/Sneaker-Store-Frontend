import { apiClient } from "../services/apiClient";

const storeInfoAPI = {
  // Public
  get: () => apiClient.get("/store-info"),

  // Admin
  update: (data) =>
    apiClient.put("/admin/store-info", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default storeInfoAPI;

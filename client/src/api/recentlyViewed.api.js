import { apiClient } from "../services/apiClient";

export const recentlyViewedAPI = {
  add: (productId) =>
    apiClient.post("/recently-viewed", { productId }),
  getAll: (params) =>
    apiClient.get("/recently-viewed", { params }),
};

export default recentlyViewedAPI;
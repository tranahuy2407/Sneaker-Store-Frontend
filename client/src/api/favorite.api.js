import { apiClient } from "../services/apiClient";

export const favoriteAPI = {
  toggle: (productId) =>
    apiClient.post("/favorites", { productId }),
  getAll: (params) =>
    apiClient.get("/favorites", { params }),
  check: (productId) =>
    apiClient.get(`/favorites/check/${productId}`),
};

export default favoriteAPI;
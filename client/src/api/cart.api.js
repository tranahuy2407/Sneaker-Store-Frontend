import { apiClient } from "../services/apiClient";

export const cartAPI = {
  getCart: () => apiClient.get("/cart"),
  addToCart: (data) => apiClient.post("/cart", data),
  updateCartItem: (data) => apiClient.put("/cart", data),
  removeCartItem: (productSizeId) =>
    apiClient.delete(`/cart/${productSizeId}`),
  clearCart: () => apiClient.delete("/cart"),
};

export default cartAPI;

import { apiClient } from "../services/apiClient";

export const cartAPI = {
  // Lấy giỏ hàng
  getCart: () => apiClient.get("/cart"),

  // Thêm sản phẩm
  addToCart: (data) => apiClient.post("/cart", data),

  // Cập nhật số lượng
  updateCartItem: (data) => apiClient.put("/cart", data),

  // Xóa 1 item
  removeCartItem: (productSizeId) =>
    apiClient.delete(`/cart/${productSizeId}`),

  // Xóa toàn bộ cart
  clearCart: () => apiClient.delete("/cart"),
};

export default cartAPI;

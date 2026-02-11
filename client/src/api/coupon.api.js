import { apiClient } from "../services/apiClient";

export const couponAPI = {

  getAll: (params) =>
    apiClient.get("/coupons", { params }),

  getById: (id) =>
    apiClient.get(`/coupons/${id}`),

  create: (couponData) =>
    apiClient.post("/coupons", couponData),

  update: (id, couponData) =>
    apiClient.put(`/coupons/${id}`, couponData),

  delete: (id) =>
    apiClient.delete(`/coupons/${id}`),

  toggleActive: (id) =>
    apiClient.put(`/coupons/${id}/toggle-active`),

  addProducts: (couponId, productIds) =>
    apiClient.post(`/coupons/${couponId}/products`, {
      productIds,
    }),
};

export default couponAPI;

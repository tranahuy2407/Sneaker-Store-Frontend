import { apiClient } from "../services/apiClient";

const toFormData = (data) => {
  if (data instanceof FormData) return data;

  const formData = new FormData();

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else if (value !== null && typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const promotionAPI = {
  getAll(params) {
    return apiClient.get("/promotions", { params });
  },

  getById(id) {
    return apiClient.get(`/promotions/${id}`);
  },

  getActive() {
    return apiClient.get("/promotions/client/active");
  },

  create(data) {
    return apiClient.post("/promotions", toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id, data) {
    return apiClient.put(`/promotions/${id}`, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete(id) {
    return apiClient.delete(`/promotions/${id}`);
  },

  addCoupons(promotionId, couponIds = []) {
    return apiClient.post(
      `/promotions/${promotionId}/coupons`,
      { couponIds }
    );
  },
  addProducts(promotionId, productIds = []) {
    return apiClient.post(
      `/promotions/${promotionId}/products`,
      { productIds }
    );
  },

  removeProducts(promotionId, productIds = []) {
    return apiClient.delete(
      `/promotions/${promotionId}/products`,
      {
        data: { productIds },
      }
    );
  },
};

export default promotionAPI;
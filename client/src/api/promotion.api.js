import { apiClient } from "../services/apiClient";

/**
 * Promotion API calls
 * create/update expect multipart FormData with field 'image'
 */

const toFormData = (data) => {
  if (data instanceof FormData) return data;
  const fd = new FormData();
  Object.keys(data || {}).forEach((key) => {
    const value = data[key];
    if (value instanceof File || value instanceof Blob) fd.append(key, value);
    else if (Array.isArray(value)) value.forEach((v) => fd.append(key, v));
    else if (value != null && typeof value === "object")
      fd.append(key, JSON.stringify(value));
    else if (value !== undefined) fd.append(key, value);
  });
  return fd;
};

export const promotionAPI = {
  getAll: (params) => apiClient.get("/promotions", { params }),
  getById: (id) => apiClient.get(`/promotions/${id}`),

  create: (promotionData) =>
    apiClient.post(`/promotions`, toFormData(promotionData)),

  update: (id, promotionData) =>
    apiClient.put(`/promotions/${id}`, toFormData(promotionData)),

  delete: (id) => apiClient.delete(`/promotions/${id}`),
};

export default promotionAPI;

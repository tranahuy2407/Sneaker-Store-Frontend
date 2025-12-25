import { apiClient } from "../services/apiClient";

const toFormData = (data) => {
  if (data instanceof FormData) return data;

  const fd = new FormData();

  Object.keys(data || {}).forEach((key) => {
    const value = data[key];
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, v));
    } else if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value.toString());
      }
    }
  });

  return fd;
};

export const paymentAPI = {
  getAll: (params) => apiClient.get("/payment-methods", { params }),
  getById: (id) => apiClient.get(`/payment-methods/${id}`),
  create: (paymentData) => {
    const body = toFormData(paymentData);
    return apiClient.post(`/payment-methods`, body, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
  },
  update: (id, paymentData) => {
    const body = toFormData(paymentData);
    return apiClient.put(`/payment-methods/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => apiClient.delete(`/payment-methods/${id}`),
};

export default paymentAPI;

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

export const productAPI = {
  getAll: (params) => apiClient.get("/products", { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  getById: (id) => apiClient.get(`/products/id/${id}`),
  create: (productData) => {
    const body = toFormData(productData);
    return apiClient.post("/products", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, productData) => {
    const body = toFormData(productData);
    return apiClient.put(`/products/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export default productAPI;

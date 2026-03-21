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

export const brandAPI = {
  getAll: (params) => apiClient.get("/brands", { params }),
  getBySlug: (slug) => apiClient.get(`/brands/${slug}`),
  getById: (id) => apiClient.get(`/brands/id/${id}`),
  create: (brandData) => {
    const body = toFormData(brandData);
    return apiClient.post(`/brands`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, brandData) => {
    const body = toFormData(brandData);
    return apiClient.put(`/brands/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => apiClient.delete(`/brands/${id}`),
  getBrandProducts: (slug, params = {}) =>
    apiClient.get(`/brands/${slug}/products`, { params }),
};

export default brandAPI;

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

export const categoryAPI = {
  getAll: (params) => apiClient.get("/categories", { params }),
  getBySlug: (slug) => apiClient.get(`/categories/${slug}`),
  getById: (id) => apiClient.get(`/categories/id/${id}`),
  create: (categoryData) => {
    const body = toFormData(categoryData);
    return apiClient.post(`/categories`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, categoryData) => {
    const body = toFormData(categoryData);

    return apiClient.put(`/categories/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => apiClient.delete(`/categories/${id}`),
  getCategoryProducts: (slug, params = {}) =>
    apiClient.get(`/categories/${slug}/products`, { params }),
};

export default categoryAPI;

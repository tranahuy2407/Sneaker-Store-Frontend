import { apiClient } from "../services/apiClient";

const newsAPI = {
  // Public
  getActive: () => apiClient.get("/news"),
  getById: (id) => apiClient.get(`/news/${id}`),

  // Admin
  getAll: () => apiClient.get("/admin/news"),
  create: (data) =>
    apiClient.post("/admin/news", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    apiClient.put(`/admin/news/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => apiClient.delete(`/admin/news/${id}`),
};

export { newsAPI };
export default newsAPI;

import { apiClient } from "../services/apiClient";

export const homeSectionAPI = {
  getActive: () => {
    return apiClient.get("/home-sections");
  },
  getAll: () => {
    return apiClient.get("/admin/home-sections");
  },

  create: (data) => {
    return apiClient.post("/admin/home-sections", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id, data) => {
    return apiClient.put(`/admin/home-sections/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => {
    return apiClient.delete(`/admin/home-sections/${id}`);
  },
};

export default homeSectionAPI;

import { apiClient } from "../services/apiClient";

export const shippingCostAPI = {
  getAll: (params) =>
    apiClient.get("/shipping-costs", { params }),
  getById: (id) =>
    apiClient.get(`/shipping-costs/${id}`),
  getByName: (name) =>
    apiClient.get("/shipping-costs/lookup/by-name", {
      params: { name },
    }),

  create: (data) =>
    apiClient.post("/shipping-costs", data, {
      headers: { "Content-Type": "application/json" },
    }),

  update: (id, data) =>
    apiClient.put(`/shipping-costs/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    }),

  delete: (id) =>
    apiClient.delete(`/shipping-costs/${id}`),
};

export default shippingCostAPI;

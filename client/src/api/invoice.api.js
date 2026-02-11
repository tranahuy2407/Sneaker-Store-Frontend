import { apiClient } from "../services/apiClient";

export const invoiceAPI = {
  getAll: (params) =>
    apiClient.get("/invoices", { params }),
  getById: (id) =>
    apiClient.get(`/invoices/${id}`),

  create: (data) =>
    apiClient.post("/shipping-costs", data, {
      headers: { "Content-Type": "application/json" },
    }),

  update: (id, data) =>
    apiClient.put(`/invoices/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    }),

  delete: (id) =>
    apiClient.delete(`/invoices/${id}`),
};

export default invoiceAPI;
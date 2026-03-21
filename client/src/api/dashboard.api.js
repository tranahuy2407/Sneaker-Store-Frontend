import { apiClient } from "../services/apiClient";

export const dashboardAPI = {
  getStatistics: () => apiClient.get("/admin/dashboard/statistics"),
  getRevenueChart: (type = "daily") => apiClient.get("/admin/dashboard/revenue-chart", { params: { type } }),
  getTopProducts: (limit = 5) => apiClient.get("/admin/dashboard/top-products", { params: { limit } }),
};

export default dashboardAPI;

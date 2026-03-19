import { apiClient } from "../services/apiClient";

export const reviewAPI = {
  createReview: (data) => {
    return apiClient.post("/reviews", data);
  },

  getReviewsByProduct: (productId, params) => {
    return apiClient.get(`/reviews/product/${productId}`, { params });
  },

  getAllReviews: (params) => {
    return apiClient.get("/reviews", { params });
  },

  deleteReview: (id) => {
    return apiClient.delete(`/reviews/${id}`);
  },
};

export default reviewAPI;

import { apiClient } from "./apiClient";
import { adminAPI } from "../api/admin.api";
import { userAPI } from "../api/user.api";

export const setupAxiosInterceptors = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const requestUrl = originalRequest.url;

      const isGuestOrder = requestUrl.includes("/orders");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !requestUrl.includes("/refresh-token") &&
        !isGuestOrder
      ) {
        originalRequest._retry = true;

        try {
          // ===== ADMIN =====
          if (requestUrl.includes("/admin")) {
            await adminAPI.refreshToken();
            return apiClient(originalRequest);
          }

          // ===== USER =====
          if (requestUrl.includes("/user")) {
            await userAPI.refreshToken();
            return apiClient(originalRequest);
          }
        } catch (err) {
          console.error("Session expired");
        }
      }

      return Promise.reject(error);
    }
  );
};

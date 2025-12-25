import { apiClient } from "./apiClient";
import { adminAPI } from "../api/admin.api";
import { userAPI } from "../api/user.api";
import {
  hasUserRefreshToken,
  hasAdminRefreshToken,
} from "./cookieUtils";

export const setupAxiosInterceptors = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const requestUrl = originalRequest.baseURL
        ? originalRequest.baseURL + originalRequest.url
        : originalRequest.url;

      const isGuestOrder = requestUrl.includes("/orders");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !requestUrl.includes("/refresh-token") &&
        !isGuestOrder
      ) {
        originalRequest._retry = true;

        // ===== ADMIN =====
        if (requestUrl.includes("/admin") && hasAdminRefreshToken()) {
          try {
            await adminAPI.refreshToken();
            return apiClient(originalRequest);
          } catch (err) {
            console.error("Admin session expired, please login again!");
          }
        }

        // ===== USER =====
        if (!requestUrl.includes("/user") && hasUserRefreshToken()) {
          try {
            await userAPI.refreshToken();
            return apiClient(originalRequest);
          } catch (err) {
            console.error("User session expired, please login again!");
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  timeout: 10000, // Timeout 10 giây để tránh treo
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: thêm token từ localStorage cho mobile (cross-site cookie bị chặn)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

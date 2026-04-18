import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  timeout: 15000, // Tăng lên 15s cho mobile mạng yếu
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Thêm token từ localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const token = response.data?.data?.accessToken || response.data?.accessToken;
    const refreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;
    
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (response.data?.data?.user || response.data?.user) {
      localStorage.setItem("userData", JSON.stringify(response.data?.data?.user || response.data?.user));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.warn(`[API Error ${error.response.status}]`, error.response.data);
    } else if (error.request) {
      console.error("[API Network Error] Không nhận được phản hồi từ server");
    } else {
      console.error("[API Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

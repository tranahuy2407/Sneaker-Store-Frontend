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

// Response Interceptor: Tự động lưu token nếu có trong response
apiClient.interceptors.response.use(
  (response) => {
    // Nếu server trả về accessToken trong body (Login hoặc Refresh Token)
    const token = response.data?.data?.accessToken || response.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
      // Nếu có thông tin người dùng đi kèm, cũng cập nhật luôn
      if (response.data?.data?.user || response.data?.user) {
        localStorage.setItem("userData", JSON.stringify(response.data?.data?.user || response.data?.user));
      }
    }
    return response;
  },
  (error) => {
    // Log lỗi chi tiết để debug trên mobile
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

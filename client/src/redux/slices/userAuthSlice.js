import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../../api/user.api";

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userAPI.register(credentials);
      return { user: res.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại !"
      );
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userAPI.login(credentials);
      return { user: res.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại !"
      );
    }
  }
);

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await userAPI.googleLogin(idToken);
      return { user: res.data.data || res.data.user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Xác thực Google thất bại !"
      );
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await userAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại !"
      );
    }
  }
);

/* ================= CHECK AUTH ================= */
export const checkUserAuth = createAsyncThunk(
  "auth/checkUserAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.getProfile();
      return { user: res.data.data, isAuthenticated: true };
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || !error.response) {
        return rejectWithValue("Lỗi kết nối");
      }
      if (error.response?.status === 401) {
        try {
          const refreshRes = await userAPI.refreshToken();
          const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
          }
          const retry = await userAPI.getProfile();
          return { user: retry.data.data, isAuthenticated: true };
        } catch (refreshError) {
          if (refreshError.code === "ECONNABORTED" || !refreshError.response) {
            return rejectWithValue("Lỗi kết nối");
          }
          return rejectWithValue("Phiên đăng nhập hết hạn");
        }
      }
      return rejectWithValue("Không xác thực");
    }
  }
);

export const refreshUserProfile = createAsyncThunk(
  "auth/refreshUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.getProfile();
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy profile"
      );
    }
  }
);

/* ================= SLICE ================= */
// Kiểm tra localStorage để khôi phục trạng thái auth trên mobile
const storedToken = localStorage.getItem("accessToken");
let storedUser = null;
try {
  const userData = localStorage.getItem("userData");
  if (userData && userData !== "undefined") {
    storedUser = JSON.parse(userData);
  }
} catch (e) {
  console.error("Lỗi parse userData từ localStorage:", e);
  localStorage.removeItem("userData");
}

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    user: storedUser,
    isAuthenticated: !!storedToken, // Duy trì trạng thái đăng nhập dựa trên token có sẵn
    profileLoaded: !!storedUser,
    loading: false,
    error: null,
    checkingAuth: !!storedToken,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
        state.profileLoaded = true;
        // Đảm bảo lưu thông tin người dùng ngay lập tức
        if (action.payload.user) {
          localStorage.setItem("userData", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GOOGLE LOGIN */
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
        state.profileLoaded = true;
        if (action.payload.user) {
          localStorage.setItem("userData", JSON.stringify(action.payload.user));
        }
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      })

      /* CHECK AUTH */
      .addCase(checkUserAuth.pending, (state) => {
        state.checkingAuth = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
        state.profileLoaded = true;
        state.error = null;
        if (action.payload.user) {
          localStorage.setItem("userData", JSON.stringify(action.payload.user));
        }
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.checkingAuth = false;
        state.error = action.payload;
        
        // Chỉ xóa token và logout nếu server xác nhận token không hợp lệ (401)
        if (action.payload === "Phiên đăng nhập hết hạn" || action.payload === "Không xác thực") {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
        } else {
          // Các lỗi khác (mạng, server 500) -> Giữ nguyên trạng thái để thử lại sau
          // Giả định vẫn còn token để không đẩy user ra login
          if (localStorage.getItem("accessToken")) {
            state.isAuthenticated = true;
          }
        }
      })

      /* REFRESH PROFILE */
      .addCase(refreshUserProfile.pending, (state) => {
        state.profileLoaded = false;
      })
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.profileLoaded = true;
      })
      .addCase(refreshUserProfile.rejected, (state) => {
        state.profileLoaded = false;
      });
  },
});

export const { clearUserError } = userAuthSlice.actions;
export default userAuthSlice.reducer;

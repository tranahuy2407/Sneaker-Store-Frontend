import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from "../../api/admin.api";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminAPI.login(credentials);
      if (response.data.status === "success") {
        return { user: response.data.data };
      }
      return rejectWithValue("Đăng nhập thất bại !");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Đăng nhập thất bại !");
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.logout();
      if (response.data.status === "success") return null;
      return rejectWithValue("Đăng nhập thất bại !");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Đăng nhập thất bại !");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getProfile();
      return { user: res.data.data, isAuthenticated: true };
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await adminAPI.refreshToken();
          const retry = await adminAPI.getProfile();
          return { user: retry.data.data, isAuthenticated: true };
        } catch {
          return rejectWithValue("Phiên đăng nhập hết hạn");
        }
      }
      return rejectWithValue("Không xác thực");
    }
  }
);


const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  checkingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

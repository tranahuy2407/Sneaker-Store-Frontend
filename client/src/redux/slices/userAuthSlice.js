import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../../api/user.api";
import { hasUserRefreshToken } from "../../services/cookieUtils";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userAPI.register(credentials);
      if (res.data.status === "success") {
        return { user: res.data.data };
      }
      return rejectWithValue("Đăng ký thất bại !");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại !"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userAPI.login(credentials);
      if (res.data.status === "success") {
        return { user: res.data.data };
      }
      return rejectWithValue("Đăng nhập thất bại !");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại !"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.logout();
      if (res.data.status === "success") return null;
      return rejectWithValue("Đăng xuất thất bại !");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại !"
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  "auth/checkUserAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.getProfile();
      if (res.data.status === "success") {
        return { user: res.data.data, isAuthenticated: true };
      }
      return rejectWithValue("Not authenticated");
    } catch (error) {
      if (error.response?.status === 401 && hasUserRefreshToken()) {
        try {
          await userAPI.refreshToken();
          const retry = await userAPI.getProfile();
          if (retry.data.status === "success") {
            return { user: retry.data.data, isAuthenticated: true };
          }
        } catch {
          return rejectWithValue(
            "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
          );
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
      if (res.data.status === "success") {
        return res.data.data;
      }
      return rejectWithValue("Không thể lấy thông tin người dùng");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy profile"
      );
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  profileLoaded: false,
  loading: false,
  error: null,
  checkingAuth: true,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
      })

      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkingAuth = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
      })
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

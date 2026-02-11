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
      if (error.response?.status === 401) {
        try {
          await userAPI.refreshToken();
          const retry = await userAPI.getProfile();
          return { user: retry.data.data, isAuthenticated: true };
        } catch {
          return rejectWithValue("Phiên đăng nhập hết hạn");
        }
      }
      return rejectWithValue("Không xác thực");
    }
  }
);

/* ================= REFRESH PROFILE ================= */
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
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
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

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
      })

      /* CHECK AUTH */
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

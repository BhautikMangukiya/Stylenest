import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Load saved user from localStorage
const savedUser = localStorage.getItem("userInfo");
const userFromStorage = savedUser ? JSON.parse(savedUser) : null;

// Ensure guestId exists
const generateGuestId = () =>
  `guest-${Math.random().toString(36).substring(2)}${Math.random()
    .toString(36)
    .substring(2)}`;

const savedGuestId = localStorage.getItem("guestId") || generateGuestId();
localStorage.setItem("guestId", savedGuestId);

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: savedGuestId,
  loading: false,
  error: null,
};

//
// Thunks
//

// User login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("userToken", token);

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// User registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, userData);

      const { user, token } = response.data;

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("userToken", token);

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

//
// Slice
//

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      const newGuestId = generateGuestId();
      state.guestId = newGuestId;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", newGuestId);
    },

    regenerateGuestId: (state) => {
      const newGuestId = generateGuestId();
      state.guestId = newGuestId;
      localStorage.setItem("guestId", newGuestId);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, regenerateGuestId } = authSlice.actions;
export default authSlice.reducer;

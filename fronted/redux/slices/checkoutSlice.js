import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// async to create a checkout session
export const createCheckoutSession = createAsyncThunk(
  "checkout/createCheckoutSession",
  async (cartItems, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/checkout`, cartItems, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create checkout session"
      );
    }
  }
);

const chekoutSlice = createSlice({
  name: "checkout",
  initialState: {
    sessionId: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to create checkout session";
      });
  },
});

 
export default chekoutSlice.reducer;
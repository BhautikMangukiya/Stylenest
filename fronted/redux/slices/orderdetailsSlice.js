import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchOrderDetailsById = createAsyncThunk(
  "orderDetails/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orderdetails/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: {
    order: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;

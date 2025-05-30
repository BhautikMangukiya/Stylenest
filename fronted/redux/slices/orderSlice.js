import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Async thunk to fetch user orders
export const fetchUserOrder = createAsyncThunk(
  "order/fetchUserOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

// Async thunk to fetch order details by order ID
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
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

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch user orders";
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch order details";
      });
  },
});

export default ordersSlice.reducer;
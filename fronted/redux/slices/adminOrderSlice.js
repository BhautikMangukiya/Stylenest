import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch all admin orders
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (__DO_NOT_USE_ActionTypes, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

// Thunk: Delete an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    totalOrders: 0,
    totalSales: 0,
  },
  reducers: {
    resetOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        // Calculate total sales
        const totalSales = action.payload.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.orders.findIndex((o) => o._id === updated._id);
        if (index !== -1) {
          state.orders[index] = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update order";
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete order";
      });
  },
});

export const { resetOrderError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

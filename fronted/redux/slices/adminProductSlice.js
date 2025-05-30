import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = localStorage.getItem("userToken");

// async thunk to fetch all admin products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/admin/products`, {
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });
    return response.data;
  }
);

// async thunk to Create a new product
export const CreateProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// async thunk to UPDATE an existing product
export const updateAdminProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// async thunk to DELETE a product
export const deleteAdminProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch products";
      })
      .addCase(CreateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(CreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to create product";
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to update product";
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products.splice(index, 1);
        }
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to delete product";
      });
  },
});

export default adminProductSlice.reducer;
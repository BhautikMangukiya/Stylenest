import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to normalize filter values
const normalizeFilters = (filters) => {
  const normalized = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        normalized[key] = value.map((v) => v.toLowerCase());
      } else if (typeof value === "string") {
        normalized[key] = value.toLowerCase();
      } else {
        normalized[key] = value;
      }
    }
  });
  return normalized;
};

// Upload images to the server
const uploadImages = async (imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) return [];
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));
  const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.images;
};

export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters) => {
    const normalizedFilters = normalizeFilters(filters);
    const params = new URLSearchParams();
    Object.entries(normalizedFilters).forEach(([key, value]) => {
      if (value) params.append(key, Array.isArray(value) ? value.join(",") : value);
    });

    const response = await axios.get(`${BASE_URL}/api/products?${params}`);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const response = await axios.get(`${BASE_URL}/api/products/${id}`);
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async ({ productData, imageFiles }, { rejectWithValue }) => {
    try {
      // Upload images first
      const uploadedImages = await uploadImages(imageFiles);

      // Include uploaded image URLs in product data
      const finalProductData = {
        ...productData,
        images: uploadedImages,
      };

      const response = await axios.post(`${BASE_URL}/api/products`, finalProductData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData, imageFiles }, { rejectWithValue }) => {
    try {
      // Upload new images if provided
      const uploadedImages = await uploadImages(imageFiles);

      // Include uploaded image URLs in product data
      const finalProductData = {
        ...productData,
        images: uploadedImages.length > 0 ? uploadedImages : productData.images,
      };

      const response = await axios.put(`${BASE_URL}/api/products/${id}`, finalProductData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/products/best-seller`);
    return response.data;
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/products/new-arrivals`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    bestSellers: [],
    newArrivals: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      Object.keys(state.filters).forEach((key) => {
        state.filters[key] = "";
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
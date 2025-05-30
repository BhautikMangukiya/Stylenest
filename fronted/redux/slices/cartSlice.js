import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

// Save cart to localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thunks

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/cart`, {
        productId,
        quantity,
        userId,
        guestId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (
    { productId, quantity, size, color, userId, guestId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/cart`, {
        data: { productId, size, color, userId, guestId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove product from cart"
      );
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async ({ user, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/cart/merge`,
        { user, guestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to merge guest cart"
      );
    }
  }
);

// Slice

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // Add
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart.push(action.payload);
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload  || "Failed to add product to cart";
      })

      // Update
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.cart.findIndex(
          (item) =>
            item.productId === updatedItem.productId &&
            item.size === updatedItem.size &&
            item.color === updatedItem.color
        );
        if (index !== -1) {
          state.cart[index] = updatedItem;
        }
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update cart";
      })

      // Remove
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const removedItem = action.payload;
        state.cart = state.cart.filter(
          (item) =>
            !(
              item.productId === removedItem.productId &&
              item.size === removedItem.size &&
              item.color === removedItem.color
            )
        );
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove product from cart";
      })

      // Merge Guest Cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to merge guest cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

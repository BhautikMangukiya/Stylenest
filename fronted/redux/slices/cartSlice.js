import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Local Storage Utils
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Ensure guestId exists
const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
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
  async ({ productId, quantity, size, color, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
      const response = await axios.post(`${BASE_URL}/api/cart`, {
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
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, size, color, quantity, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
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
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
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
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.cart.findIndex(
          (p) =>
            p.productId === item.productId &&
            p.size === item.size &&
            p.color === item.color
        );

        if (index >= 0) {
          state.cart[index].quantity += item.quantity;
        } else {
          state.cart.push(item);
        }
        saveCartToLocalStorage(state.cart);
      })

      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.cart.findIndex(
          (p) =>
            p.productId === item.productId &&
            p.size === item.size &&
            p.color === item.color
        );
        if (index !== -1) {
          state.cart[index].quantity = item.quantity;
        }
        saveCartToLocalStorage(state.cart);
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { productId, size, color } = action.payload;
        state.cart = state.cart.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.color === color
            )
        );
        saveCartToLocalStorage(state.cart);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

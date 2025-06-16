import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Utilities
const loadCartFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
      const { data } = await axios.get(`${BASE_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return data;
    } catch (err) {
      console.error('Fetch cart error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Unable to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, size, color, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
      const { data } = await axios.post(`${BASE_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return data;
    } catch (err) {
      console.error('Add to cart error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Unable to add to cart');
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, size, color, quantity, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
      const { data } = await axios.put(`${BASE_URL}/api/cart`, {
        productId,
        size,
        color,
        quantity,
        userId,
        guestId,
      });
      return data;
    } catch (err) {
      console.error('Update cart error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, size, color, userId }, { rejectWithValue }) => {
    try {
      const guestId = userId ? null : getGuestId();
      const { data } = await axios.delete(`${BASE_URL}/api/cart/item`, {
        data: { productId, size, color, userId, guestId },
      });
      return data;
    } catch (err) {
      console.error('Remove from cart error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/cart/merge`, {
        guestId,
        userId: user._id,
      });
      return data;
    } catch (err) {
      console.error('Merge cart error:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Failed to merge cart');
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      try {
        state.cart = null;
        localStorage.removeItem('cart');
        localStorage.removeItem('guestId');
      } catch (e) {
        console.warn('Failed to clear cart from localStorage:', e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
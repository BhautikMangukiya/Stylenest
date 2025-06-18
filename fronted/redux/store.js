import { configureStore } from "@reduxjs/toolkit";

// User & Customer Flow
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import orderDetailsReducer from "./slices/orderdetailsSlice"

// Admin Flow
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice"; 
import adminOrdersReducer from "./slices/adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    orderDetails: orderDetailsReducer,

    // Admin Reducers
    admin: adminReducer,
    adminProduct: adminProductReducer,
    adminDashboard: adminDashboardReducer,
    adminOrders: adminOrdersReducer,
  },
});


export default store;

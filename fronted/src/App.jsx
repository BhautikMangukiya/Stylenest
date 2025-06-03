import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

// Layouts
import UserLayout from "./componets/Layout/UserLayout/UserLayout";
import AdminLayout from "./componets/Admin/AdminLayout/AdminLayout";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import Checkout from "./componets/Cart/Checkout/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

// Admin Pages
import AdminHomePage from "./componets/Admin/AdminHomePage/AdminHomePage";
import UserManagement from "./componets/Admin/UserManagement/UserManagement";
import OrderManagement from "./componets/Admin/OrderManagement/OrderManagement";
import ProductManagement from "./componets/Admin/ProductManagement/ProductManagement";
import EditProductPage from "./componets/Admin/EditProductPage/EditProductPage";

// Toast Notifications
import { Toaster } from "sonner";

// Global Styles
import "./app.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionsPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="orderdetails/:id" element={<OrderDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

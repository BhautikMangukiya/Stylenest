import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

// Layouts
import UserLayout from "./componets/Layout/UserLayout/UserLayout";
import AdminLayout from "./componets/Admin/AdminLayout/AdminLayout";

// Pages (User)
import Home from "./pages/Home/Home";
import Login from "./pages/Login/login";
import Register from "./pages//Register/register";
import Profile from "./pages/Profile/Profile";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import CartPage from "./componets/Layout/CartPage/CartPage";
import Checkout from "./componets/Cart/Checkout/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import SelectedProduct from "./pages/SelectedProduct/SelectedProduct";

// Pages (Admin)
import AdminHomePage from "./componets/Admin/AdminHomePage/AdminHomePage";
import UserManagement from "./componets/Admin/UserManagement/UserManagement";
import OrderManagement from "./componets/Admin/OrderManagement/OrderManagement";
import ProductManagement from "./componets/Admin/ProductManagement/ProductManagement";
import EditProductPage from "./componets/Admin/EditProductPage/EditProductPage";
import AddNewProduct from "./componets/Products/AddNewProduct/AddNewProduct";

// Toast Notifications
import { Toaster } from "sonner";

// Protected Route
import ProtectedAdminRoute from "./componets/ProtectedAdmin/ProtectedAdminRoute";

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
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="orderdetails/:id" element={<OrderDetails />} />
            <Route path="product/:id" element={<SelectedProduct />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="products/add" element={<AddNewProduct />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./componets/Cart/CartContent";
import UserLayout from "./componets/Layout/UserLayout/UserLayout";
import "./app.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import Profile from "./pages/Profile/profile";
import { Toaster } from "sonner";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import Checkout from "./componets/Cart/Checkout/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import AdminLayout from "./componets/Admin/AdminLayout/AdminLayout";
import UserManagement from "./componets/Admin/UserManagement/UserManagement";
import OrderManagement from "./componets/Admin/OrderManagement/OrderManagement";
import AdminHomePage from "./componets/Admin/AdminHomePage/AdminHomePage";
import ProductManagement from "./componets/Admin/ProductManagement/ProductManagement";
import EditProductPage from "./componets/Admin/EditProductPage/EditProductPage";

import { Provider } from "react-redux";
import store from "../redux/store"; // Assuming you have a Redux store set up

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="collections/:collection"
                element={<CollectionsPage />}
              />
              <Route path="checkout" element={<Checkout />} />{" "}
              {/* <Route path="product/:id" element={<ProductDetails />} ></Route> */}
              <Route
                path="order-confirmation"
                element={<OrderConfirmationPage />}
              />
              <Route path="/orderdetails/:id" element={<OrderDetails />} />
            </Route>

            {/* admin */}

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </Provider>
  );
}

export default App;

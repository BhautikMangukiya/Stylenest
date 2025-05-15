import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./componets/Cart/CartContent";
import UserLayout from "./componets/Layout/UserLayout/UserLayout";
import "./app.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register"
import Profile from "./pages/Profile/profile"
import { Toaster } from "sonner";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import Checkout from "./componets/Cart/Checkout/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import AdminLayout from "./componets/Admin/AdminLayout/AdminLayout";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionsPage/>} />
            {/* <Route path="product/:id" element={<ProductDetails />} ></Route> */}
            <Route path="chekout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/OrderDetails/:id" element={<OrderDetails />} />
          </Route>

          {/* admin */}

          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import "./Checkout.css";
import PaytmButton from "../PaytmButton/PaytmButton";
import { createCheckoutSession } from "../../../../redux/slices/checkoutSlice";
import { clearCart } from "../../../../redux/slices/cartSlice"; // ✅ added

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [formError, setFormError] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleContinueToPayment = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "country",
      "phone",
    ];
    const isValid = requiredFields.every((field) => shippingAddress[field]);

    if (!isValid) {
      setFormError("Please fill in all required shipping details.");
      return;
    }

    try {
      const res = await dispatch(
        createCheckoutSession({
          checkOutItems: cart.products,
          ShippingAddress: shippingAddress,
          paymentMethod: "Paytm",
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        setShowPaymentOptions(true);
      }
    } catch (err) {
      console.error("Checkout creation failed:", err);
      setFormError("Failed to proceed with checkout. Try again.");
    }
  };

const handlePaymentSuccess = async () => {
  try {
    const token = localStorage.getItem("userToken");

    // 1. Mark checkout as paid
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
      {
        paymentStatus: "paid",
        paymentDetails: { method: "UPI", gateway: "Paytm QR" },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 2. Finalize checkout session
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 3. Create order
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
      {
        orderItems: cart.products,
        shippingAddress,
        paymentMethod: "Paytm",
        totalPrice: cart.totalPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 4. Clear the cart - both backend and frontend
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      {
        data: { userId: user._id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 5. Update Redux state and localStorage
    dispatch(clearCart()); // This will clear the cart in Redux and localStorage

    // 6. Redirect to order history
    navigate("/my-orders");
  } catch (error) {
    console.error("Payment finalization failed:", error);
    setFormError("Payment processing failed. Please try again.");
  }
};

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="form-section-checkout">
          <h2 className="section-heading">Checkout</h2>
          <form onSubmit={handleContinueToPayment} className="checkout-form">
            <h3>Contact Details</h3>
            <input
              type="email"
              name="email"
              value={shippingAddress.email}
              onChange={handleChange}
              className="input-full"
              placeholder="Email"
              required
            />
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={shippingAddress.firstName}
                onChange={handleChange}
                required
                className="input-half"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={shippingAddress.lastName}
                onChange={handleChange}
                required
                className="input-half"
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={handleChange}
              required
              className="input-full"
            />
            <div className="input-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleChange}
                required
                className="input-half"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={handleChange}
                required
                className="input-half"
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={handleChange}
              required
              className="input-full"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={handleChange}
              required
              className="input-full"
            />
            {formError && <p className="error-message">{formError}</p>}

            {!showPaymentOptions ? (
              <button type="submit" className="submit-button">
                Continue to Payment
              </button>
            ) : (
              <PaytmButton
                amount={cart.totalPrice}
                checkoutId={checkoutId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </form>
        </div>

        <div className="summary-section">
          <h2 className="section-heading">Order Summary</h2>
          <div className="ordered-products">
            {cart.products.map((product, index) => (
              <div className="product-item" key={index}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="checkout-product-image"
                />
                <div className="order-summary-product-details">
                  <h3>{product.name}</h3>
                  <p>Size: {product.size}</p>
                  <p>Color: {product.color}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
                <p className="product-price">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            ))}
            <div className="total-price">
              <div className="price-row">
                <h3>Subtotal</h3>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <h3>Shipping</h3>
                <span className="free-shipping">Free</span>
              </div>
              <div className="price-row total-row">
                <h3>Total</h3>
                <span className="total-amount">
                  ₹{cart.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

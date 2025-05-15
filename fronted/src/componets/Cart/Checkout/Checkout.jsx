// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Checkout.css";
import PaytmButton from "../PaytmButton/PaytmButton";

const cart = {
  products: [
    {
      name: "T-Shirt",
      size: "M",
      color: "Red",
      price: 699,
      image:
        "https://images.unsplash.com/photo-1649879681508-e21645a743bc?q=80&w=2080&auto=format&fit=crop",
    },
    {
      name: "Jeans",
      size: "32",
      color: "Blue",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1649879681508-e21645a743bc?q=80&w=2080&auto=format&fit=crop",
    },
  ],
  totalPrice: 1198,
};

function Checkout() {
  const navigate = useNavigate();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    email: "user123@gmail.com",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    setFormError("");
  };

  const handleContinueToPayment = (e) => {
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

    if (isValid) {
      setShowPaymentOptions(true);
    } else {
      setFormError("Please fill in all required shipping details.");
    }
  };

  const handlePaymentSuccess = () => {
    const transactionDetails = {
      transactionId: "Paytm123456789",
      status: "success",
      paidTo: "8780341577@pytes",
      method: "Paytm",
    };

    navigate("/order-confirmation", {
      state: {
        cart,
        shippingAddress,
        method: "paytm",
        transactionDetails,
      },
    });
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        {/* Left Section: Form */}
        <div className="form-section">
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
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </form>
        </div>

        {/* Right Section: Order Summary */}
        <div className="summary-section">
          <h2 className="section-heading">Order Summary</h2>
          <div className="ordered-products">
            {cart.products.map((product, index) => (
              <div className="product-item" key={index}>
                <img
                  src={product.image}
                  alt={`${product.name} in ${product.color}`}
                  className="checkout-product-image"
                />
                <div className="order-summary-product-details">
                  <h3>{product.name}</h3>
                  <p>Size: {product.size}</p>
                  <p>Color: {product.color}</p>
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

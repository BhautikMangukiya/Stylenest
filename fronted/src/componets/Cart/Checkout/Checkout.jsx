import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import PaypalButton from "../PaypalButton/PaypalButton";

const cart = {
  products: [
    {
      name: "T-Shirt",
      size: "M",
      color: "Red",
      price: 699,
      image: "https://images.unsplash.com/photo-1649879681508-e21645a743bc?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jeans",
      size: "32",
      color: "Blue",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1649879681508-e21645a743bc?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const [paymentError, setPaymentError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    setFormError(""); // Clear error on input change
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      shippingAddress.country &&
      shippingAddress.phone
    ) {
      setShowPaymentOptions(true);
      setFormError("");
    } else {
      setFormError("Please fill in all required shipping details.");
    }
  };

  const handlePayWithPaypal = () => {
    console.log("Pay with PayPal");
    navigate("/order-confirmation", {
      state: { cart, shippingAddress, method: "paypal" },
    });
  };

  const handlePayWithCard = () => {
    console.log("Pay with Card");
    navigate("/order-summary", {
      state: { cart, shippingAddress, method: "card" },
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
            <div className="button-container">
              {!showPaymentOptions ? (
                <button type="submit" className="submit-button">
                  Continue to Payment
                </button>
              ) : (
                <div className="payment-options">
                  <h3>Pay with PayPal</h3>
                  <PaypalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePayWithPaypal}
                    onError={(err) => setPaymentError("Payment failed. Please try again.")}
                  />
                  <button
                    type="button"
                    onClick={handlePayWithCard}
                    className="payment-button card-button"
                  >
                    Pay with Card
                  </button>
                  {paymentError && <p className="error-message">{paymentError}</p>}
                </div>
              )}
            </div>
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
                <p className="product-price">₹{product.price.toLocaleString()}</p>
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
    <span className="total-amount">₹{cart.totalPrice.toLocaleString()}</span>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
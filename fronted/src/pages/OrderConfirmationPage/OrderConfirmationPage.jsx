import React from "react";
import "./OrderConfirmationPage.css";

const checkout = {
  _id: "12312",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "prod_001",
      name: "Classic White T-Shirt",
      color: "White",
      size: "M",
      price: 799,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    },
    {
      productId: "prod_002",
      name: "Slim Fit Jeans",
      color: "Dark Blue",
      size: "32",
      price: 1499,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    },
    {
      productId: "prod_003",
      name: "Casual Sneakers",
      color: "Black",
      size: "10",
      price: 2299,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
    },
  ],
  shippingAddress: {
    address: "123 Fashion Street",
    city: "Surat",
    country: "India",
  },
  paymentMethod: "Credit Card",
  shippingMethod: "Standard Delivery",
  subtotal: 4597,
  shippingFee: "Free",
  total: 4597,
};

function OrderConfirmationPage() {
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // add 10 days to the order date
    return orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Logic to format shipping fee
  const formatShippingFee = (fee) => {
    if (typeof fee === "string") {
      return fee; // Return "Free" or any other string directly
    }
    return `₹${fee.toLocaleString()}`; // Format number with currency
  };

  return (
    <div className="order-confirmation">
      <header className="order-confirmation__header">
        <h1 className="order-confirmation__title">Thank You for Your Order!</h1>
        <p className="order-confirmation__subtitle">We've received your order and it's being processed</p>
      </header>

      {checkout && (
        <div className="order-confirmation__content">
          {/* Order Summary Section */}
          <section className="order-summary">
            <div className="order-summary__meta">
              <h2 className="order-summary__id">Order # {checkout._id}</h2>
              <p className="order-summary__date">
                Placed on {new Date(checkout.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="order-summary__delivery">
                Estimated delivery: {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>

            {/* Ordered Items */}
            <div className="order-summary__items">
              <h3 className="order-summary__items-title">Your Items</h3>
              {checkout.checkoutItems.map((item) => (
                <div className="order-item" key={item.productId}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="order-item__image" 
                  />
                  <div className="order-item__details">
                    <h4 className="order-item__name">{item.name}</h4>
                    <p className="order-item__attributes">{item.color} | Size: {item.size}</p>
                    <p className="order-item__price">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="order-item__quantity">
                    Qty: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment and Shipping Info */}
          <section className="order-info">
            <div className="order-info__shipping">
              <h3 className="order-info__title">Shipping Address</h3>
              <p className="order-info__address">
                {checkout.shippingAddress.address}<br />
                {checkout.shippingAddress.city},<span> </span>
                {checkout.shippingAddress.country}
              </p>
              <p className="order-info__method">
                Shipping method: {checkout.shippingMethod}
              </p>
            </div>

            <div className="order-info__payment">
              <h3 className="order-info__title">Payment Method</h3>
              <p className="order-info__method">{checkout.paymentMethod}</p>
            </div>

            <div className="order-info__totals">
              <h3 className="order-info__title">Order Summary</h3>
              <div className="order-total">
                <span className="order-total__label">Subtotal</span>
                <span className="order-total__value">₹{checkout.subtotal.toLocaleString()}</span>
              </div>
              <div className="order-total">
                <span className="order-total__label">Shipping</span>
                <span className="order-total__value">{formatShippingFee(checkout.shippingFee)}</span>
              </div>
              <div className="order-total order-total--grand">
                <span className="order-total__label">Total</span>
                <span className="order-total__value">₹{checkout.total.toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmationPage;
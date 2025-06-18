import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("You must be logged in to view this page.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orderdetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Could not load order details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (isLoading) {
    return <p className="order-details__loading">Loading...</p>;
  }

  if (error) {
    return <p className="order-details__error">{error}</p>;
  }

  if (!orderDetails) {
    return <p className="order-details__empty-message">Order not found.</p>;
  }

  return (
    <div className="order-details__container">
      <h2 className="order-details__title">Order Details</h2>

      <div className="order-details__content">
        {/* Header */}
        <div className="order-details__header">
          <div className="order-details__info">
            <div className="order-details__id-date">
              <h3>Order ID: #{orderDetails._id}</h3>
              <p>
                Date:{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="order-details__status">
              <span
                className={`order-details__status-badge ${
                  orderDetails.isPaid ? "paid" : "unpaid"
                }`}
              >
                {orderDetails.isPaid
                  ? `Paid on ${new Date(
                      orderDetails.paidAt
                    ).toLocaleDateString("en-IN")}`
                  : "Payment Pending"}
              </span>
              <span
                className={`order-details__status-badge ${
                  orderDetails.isDelivered ? "delivered" : "undelivered"
                }`}
              >
                {orderDetails.isDelivered
                  ? `Delivered on ${new Date(
                      orderDetails.deliveredAt
                    ).toLocaleDateString("en-IN")}`
                  : "Pending Delivery"}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="order-details__meta">
          <p>
            <strong>Payment Method:</strong> {orderDetails.paymentMethod}
          </p>
          <p>
            <strong>Shipping Address:</strong>{" "}
            {orderDetails.shippingAddress.address},{" "}
            {orderDetails.shippingAddress.city},{" "}
            {orderDetails.shippingAddress.postalCode},{" "}
            {orderDetails.shippingAddress.country}
          </p>
          <p>
            <strong>Total:</strong> ₹{orderDetails.totalPrice.toLocaleString()}
          </p>
          <p>
            <strong>Order Status:</strong> {orderDetails.status}
          </p>
        </div>

        {/* Order Items */}
        <div className="order-details__items">
          <h3>Items</h3>
          <div className="order-details__items-table">
            <div className="order-details__items-header">
              <span>Image</span>
              <span>Name</span>
              <span>Size</span>
              <span>Color</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            {orderDetails.orderItems.map((item, index) => (
              <div className="order-details__item" key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-details__item-image"
                />
                <Link
                  to={`/product/${item.productId}`}
                  className="order-details__item-name"
                >
                  {item.name}
                </Link>
                <span>{item.size}</span>
                <span>{item.color}</span>
                <span>₹{item.price.toLocaleString()}</span>
                <span>{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

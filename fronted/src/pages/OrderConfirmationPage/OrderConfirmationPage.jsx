// File: OrderConfirmationPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderConfirmationPage.css";

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("Please log in to view your order.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Order API response:", response.data); 
        setOrder(response.data);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setError("Invalid order ID.");
      setLoading(false);
      navigate("/");
    }
  }, [orderId, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    if (!createdAt) return "N/A";
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <p className="order-confirmation__loading">Loading order confirmation...</p>;
  }

  if (error) {
    return <p className="order-confirmation__error">{error}</p>;
  }

  if (!order) {
    return <p className="order-confirmation__error">No order details available.</p>;
  }

  return (
    <div className="order-confirmation">
      <header className="order-confirmation__header">
        <h1 className="order-confirmation__title">Thank You for Your Order!</h1>
        <p className="order-confirmation__subtitle">
          We've received your order and it's being processed
        </p>
      </header>

      <div className="order-confirmation__content">
        <section className="order-summary">
          <div className="order-summary__meta">
            <h2 className="order-summary__id">Order # {order._id || "N/A"}</h2>
            <p className="order-summary__date">
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="order-summary__delivery">
              Estimated delivery: {calculateEstimatedDelivery(order.createdAt)}
            </p>
          </div>

          <div className="order-summary__items">
            <h3 className="order-summary__items-title">Your Items</h3>
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div
                  className="order-item"
                  key={item.productId ? `${item.productId}-${index}` : index}
                >
                  <img
                    src={item.image || "/placeholder-image.png"}
                    alt={item.name || "Product"}
                    className="order-item__image"
                  />
                  <div className="order-item__details">
                    <h4 className="order-item__name">{item.name || "Unknown Product"}</h4>
                    <p className="order-item__attributes">
                      {item.color || "N/A"} | Size: {item.size || "N/A"}
                    </p>
                    <p className="order-item__price">
                      ₹{(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="order-item__quantity">
                    Qty: {item.quantity || 1}
                  </div>

                   
                </div>
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>
        </section>

        <section className="order-info">
          <div className="order-info__shipping">
            <h3 className="order-info__title">Shipping Address</h3>
            <p className="order-info__address">
              {order.shippingAddress?.address || "N/A"}
              <br />
              {order.shippingAddress?.city
                ? `${order.shippingAddress.city}, ${order.shippingAddress.country || "N/A"}`
                : "N/A"}
            </p>
            <p className="order-info__method">Shipping method: Standard Delivery</p>
          </div>

          <div className="order-info__payment">
            <h3 className="order-info__title">Payment Method</h3>
            <p className="order-info__method">{order.paymentMethod || "N/A"}</p>
          </div>

          <div className="order-info__totals">
            <h3 className="order-info__title">Order Summary</h3>
            <div className="order-total">
              <span className="order-total__label">Total</span>
              <span className="order-total__value">
                ₹{(order.totalPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
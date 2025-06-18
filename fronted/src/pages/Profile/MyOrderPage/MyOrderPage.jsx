import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrderPage.css";

function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleGoHome = () => navigate("/");

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={handleGoHome} className="home-btn">
          Go to Home
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders found</p>
        <button onClick={handleGoHome} className="home-btn">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {/* Desktop Table View */}
      <div className="orders-table-container desktop-only">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>City</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => navigate(`/orderdetails/${order._id}`)}
              >
                <td>
                  {order.orderItems[0]?.image ? (
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>
                <td>#{order._id.slice(-6).toUpperCase()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {order.orderItems.length > 1
                    ? `${order.orderItems[0].name} +${order.orderItems.length - 1}`
                    : order.orderItems[0]?.name}
                </td>
                <td>{order.shippingAddress?.city || "-"}</td>
                <td>
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </td>
                <td>₹{order.totalPrice.toLocaleString()}</td>
                <td className={`status ${order.isPaid ? "paid" : "pending"}`}>
                  {order.isPaid ? "Paid" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-only">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/orderdetails/${order._id}`)}
          >
            <div className="order-header">
              <strong>Order: #{order._id.slice(-6).toUpperCase()}</strong>
                <div className={`order-status ${order.isPaid ? "paid" : "pending"}`}>
                {order.isPaid ? "Paid" : "Pending"}
              </div>
            </div>
            
            <div className="order-content">

<div className="order-row">
  <span className="order-row-image">
    {order.orderItems[0]?.image ? (
      <img
        src={order.orderItems[0].image}
        alt={order.orderItems[0].name}
        className="order-card-img"
      />
      
    ) : (
      <span className="no-image">No Image</span>
    )}
  </span>
</div>


              <div className="order-row">
                <span>Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-row">
                <span>Product:</span>
                <span>
                  {order.orderItems.length > 1
                    ? `${order.orderItems[0].name} +${order.orderItems.length - 1}`
                    : order.orderItems[0]?.name}
                </span>
              </div>
              <div className="order-row">
                <span>City:</span>
                <span>{order.shippingAddress?.city || "-"}</span>
              </div>
              <div className="order-row">
                <span>Items:</span>
                <span>
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>
              <div className="order-row">
                <span>Total:</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrderPage;

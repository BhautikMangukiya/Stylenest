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
          setError("You must be logged in to view your orders.");
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

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Unable to load your orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="myOrderpage-Wrap">
      <div className="my-order-page">
        <h1 className="page-title">My Orders</h1>

        {isLoading ? (
          <div className="loading-container">
            <p className="loading-text">Loading...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleGoHome} className="go-home-button">
              Go to Home
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="no-products">No orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Date</th>
                <th>Name</th>
                <th>City</th>
                <th>Items</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                // Calculate total quantity of all items in the order
                const totalQuantity = order.orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <tr
                    key={order._id}
                    className="order-row"
                    data-paid={order.isPaid}
                  >
                    <td>
                      <img
                        src={order.orderItems[0]?.image}
                        alt={order.orderItems[0]?.name}
                        className="product-image-MyOrder"
                      />
                    </td>
                    <td>#{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.orderItems[0]?.name}</td>
                    <td>{order.shippingAddress?.city || "-"}</td>
                    <td>{totalQuantity}</td>{" "}
                    {/* Changed to show total quantity */}
                    <td>₹{order.totalPrice.toLocaleString()}</td>
                    <td>{order.isPaid ? "Paid" : "Pending"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyOrderPage;

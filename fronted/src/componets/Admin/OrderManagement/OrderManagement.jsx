import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([
    { id: "ORD001", customer: "John Doe", totalPrice: 129.99, status: "Processing" },
    { id: "ORD002", customer: "Jane Smith", totalPrice: 249.50, status: "Shipped" },
    { id: "ORD003", customer: "Alice Johnson", totalPrice: 89.00, status: "Delivered" },
    { id: "ORD004", customer: "Bob Wilson", totalPrice: 499.99, status: "Cancelled" },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Change order ${orderId} status to ${newStatus}?`)) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const handleMarkAsDelivered = (orderId) => {
    if (window.confirm(`Mark order ${orderId} as Delivered?`)) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Delivered" } : order
        )
      );
    }
  };

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <select
                      className={`status-select ${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      aria-label={`Status for order ${order.id}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {order.status === "Processing" || order.status === "Shipped" ? (
                      <button
                        className="action-btn"
                        onClick={() => handleMarkAsDelivered(order.id)}
                        aria-label={`Mark order ${order.id} as Delivered`}
                      >
                        <FaCheckCircle /> Mark as Delivered
                      </button>
                    ) : (
                      <span className="no-action">{order.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
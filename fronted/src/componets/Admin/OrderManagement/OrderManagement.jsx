import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../../../redux/slices/adminOrderSlice";
import "./OrderManagement.css";

function OrderManagement() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Change order ${orderId} status to ${newStatus}?`)) {
      dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    }
  };

  const handleMarkAsDelivered = (orderId) => {
    if (window.confirm(`Mark order ${orderId} as Delivered?`)) {
      dispatch(updateOrderStatus({ id: orderId, status: "Delivered" }));
    }
  };

  return (
    <div className="order-management">
      <h2>Order Management</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Paid At</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Ordered On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id}</td>
                    <td>{order.orderItems.length}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.paymentMethod} <br />
                      <span
                        className={`payment-status ${order.paymentStatus}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {order.isPaid
                        ? new Date(order.paidAt).toLocaleDateString()
                        : "Not Paid"}
                    </td>
                    <td>
                      <select
                        className={`status-select ${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      {order.isDelivered
                        ? new Date(order.deliveredAt).toLocaleDateString()
                        : "Pending"}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {(order.status === "processing" ||
                        order.status === "shipped") &&
                      !order.isDelivered ? (
                        <button
                          className="action-btn"
                          onClick={() => handleMarkAsDelivered(order._id)}
                        >
                          <FaCheckCircle /> Mark as Delivered
                        </button>
                      ) : (
                        <span className="no-action">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="empty-state">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;

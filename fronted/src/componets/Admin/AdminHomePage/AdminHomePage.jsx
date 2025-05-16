import React from "react";
import { Link } from "react-router-dom";
import "./AdminHomePage.css";

function AdminHomePage() {
  const orders = [
    {
      _id: "123123",
      user: {
        name: "John Doe",
      },
      totalPrice: 900,
      status: "Processing",
    },
    {
      _id: "456456",
      user: {
        name: "Jane Smith",
      },
      totalPrice: 1200,
      status: "Completed",
    },
  ];

  return (
    <>
      <div className="admin-heading">
        <h1 className="admin-title">Admin Overview</h1>
      </div>

      <div className="admin-stats-container">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Revenue</h2>
            <p className="stat-value">₹ 10000</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Total Orders</h2>
            <p className="stat-value">200</p>
            <Link to="/admin/orders" className="admin-home-link">
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Total Products</h2>
            <p className="stat-value">100</p>
            <Link to="/admin/products" className="admin-home-link">
              Manage Products
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-orders-section">
        <h2 className="orders-heading">Recent Orders</h2>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead className="orders-table-head">
              <tr className="orders-table-row">
                <th className="orders-table-header">Order ID</th>
                <th className="orders-table-header">User</th>
                <th className="orders-table-header">Total Price</th>
                <th className="orders-table-header">Status</th>
              </tr>
            </thead>

            <tbody className="orders-table-body">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="orders-table-row">
                    <td className="orders-table-cell">{order._id}</td>
                    <td className="orders-table-cell">{order.user.name}</td>
                    <td className="orders-table-cell">₹ {order.totalPrice}</td>
                    <td className="orders-table-cell">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr className="orders-table-row">
                  <td colSpan={4} className="orders-empty-message">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchRecentOrders,
} from "../../../../redux/slices/adminDashboardSlice";
import { Link } from "react-router-dom";
import "./AdminHomePage.css";

function AdminHomePage() {
  const dispatch = useDispatch();
  const { stats, recentOrders, loading, error } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="admin-heading">
        <h1 className="admin-title">Admin Overview</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="admin-stats-container">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Revenue</h2>
            <p className="stat-value">₹ {stats.totalRevenue}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Total Orders</h2>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="admin-home-link">
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <h2 className="stat-title">Total Products</h2>
            <p className="stat-value">{stats.totalProducts}</p>
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
                <th className="orders-table-header">Product(s)</th>
                <th className="orders-table-header">Qty</th>
                <th className="orders-table-header">Total</th>
                <th className="orders-table-header">Payment</th>
                <th className="orders-table-header">Status</th>
                <th className="orders-table-header">Date</th>
              </tr>
            </thead>
            <tbody className="orders-table-body">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="orders-table-row">
                    <td className="orders-table-cell">
                      #{order._id}
                    </td>

                    <td className="orders-table-cell">
                      {order.orderItems?.length > 0 ? (
                        order.orderItems.map((item, idx) => (
                          <div key={idx}>
                            {item.name}
                          </div>
                        ))
                      ) : (
                        <span>No Products</span>
                      )}
                    </td>

                    <td className="orders-table-cell">
                      {order.orderItems?.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      ) || 0}
                    </td>

                    <td className="orders-table-cell">₹ {order.totalPrice}</td>

                    <td className="orders-table-cell">
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </td>

                    <td className="orders-table-cell">{order.status}</td>

                    <td className="orders-table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="orders-table-row">
                  <td colSpan={8} className="orders-empty-message">
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

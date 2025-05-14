import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "paypal",
      shippingMethod: "Standard",
      shippingAddress: {
        city: "Surat",
        country: "India",
      },
      orderItems: [
        {
          productId: "001",
          name: "Premium Cotton T-Shirt",
          price: 1299,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
        },
        {
          productId: "002",
          name: "Slim Fit Chino Pants",
          price: 2499,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80",
        },
        {
          productId: "003",
          name: "Oversized Denim Jacket",
          price: 3599,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80",
        },
      ],
    };

    setOrderDetails(mockOrderDetails);
  }, [id]);

  return (
    <div className="order-details">
      <h2 className="order-title">Order Details</h2>

      {!orderDetails ? (
        <p className="order-empty">No Order details found</p>
      ) : (
        <div className="order-content">
          {/* Order Header */}
          <div className="order-header">
            <div className="order-info">
              <h3>Order ID: #{orderDetails._id}</h3>
              <p>
                Date:{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="order-status">
              <span
                className={`status-badge ${
                  orderDetails.isPaid ? "paid" : "unpaid"
                }`}
              >
                {orderDetails.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`status-badge ${
                  orderDetails.isDelivered ? "delivered" : "undelivered"
                }`}
              >
                {orderDetails.isDelivered
                  ? "Delivered"
                  : "Pending Delivery"}
              </span>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="order-meta">
            <p>
              <strong>Payment Method:</strong> {orderDetails.paymentMethod}
            </p>
            <p>
              <strong>Shipping Method:</strong> {orderDetails.shippingMethod}
            </p>
            <p>
              <strong>Shipping To:</strong> {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.country}
            </p>
          </div>

          {/* Order Items */}
          <div className="order-items">
            <h3>Items</h3>
            <div className="order-items-table">
              {/* Table Header */}
              <div className="order-items-header">
                <span className="order-items-header__cell">Image</span>
                <span className="order-items-header__cell">Name</span>
                <span className="order-items-header__cell">Price</span>
                <span className="order-items-header__cell">Quantity</span>
              </div>
              {/* Table Rows */}
              {orderDetails.orderItems.map((item) => (
                <div className="order-item" key={item.productId}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  <Link
                    to={`/product/${item.productId}`}
                    className="item-name"
                  >
                    {item.name}
                  </Link>
                  <span className="item-price">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="item-quantity">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;

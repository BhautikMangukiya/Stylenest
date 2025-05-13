import React, { useEffect, useState } from "react";
import "./MyOrderPage.css";

function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          _id: "857469",
          createdAt: new Date(),
          shippingAddress: {
            address: "123 Main St",
            city: "New York",
            state: "NY",
            country: "USA",
            zipCode: "10001",
          },
          orderItems: [
            {
              name: "Product 1",
              image: "https://uathayam.in/cdn/shop/files/02_ca5efa4c-97ac-4c8d-9358-8da6155e4604.jpg?v=1741863163",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: "857470",
          createdAt: new Date(),
          shippingAddress: {
            address: "456 Elm St",
            city: "Los Angeles",
            state: "CA",
            country: "USA",
            zipCode: "90001",
          },
          orderItems: [
            {
              name: "Product 2",
              image: "https://uathayam.in/cdn/shop/files/02_ca5efa4c-97ac-4c8d-9358-8da6155e4604.jpg?v=1741863163",
            },
          ],
          totalPrice: 150,
          isPaid: false,
        },
      ];
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="my-order-page">
      <h1 className="page-title">My Orders</h1>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
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
            {orders.map((order) => (
              <tr key={order._id} className="order-row">
                <td>
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="product-image"
                  />
                </td>
                <td>#{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.orderItems[0].name}</td>
                <td>{order.shippingAddress.city}</td>
                <td>1</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid ? "Paid" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrderPage;
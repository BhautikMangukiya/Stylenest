// PaytmButton.jsx (Rewritten for full integration)
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaytmButton.css";

function PaytmButton({ amount, checkoutId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");

      // Mark checkout as paid
      await axios.put(
        `${BASE_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: { method: "UPI", gateway: "Paytm QR" },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Finalize the checkout and retrieve the order
      const res = await axios.post(
        `${BASE_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = res.data.order?._id;
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`);
      } else {
        alert("Order confirmation failed. Try again.");
      }
    } catch (error) {
      console.error("Payment finalization error:", error);
      alert("An error occurred while processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  const upiLink = `upi://pay?pa=8780341577@ptyes&pn=Your%20Name&am=${amount}&cu=INR`;

  return (
    <div className="qr-section">
      <h3>Pay with Paytm or any UPI App</h3>
      <QRCode
        value={upiLink}
        size={200}
        style={{ height: "auto", maxWidth: "100%", width: "200px" }}
      />
      <p>Scan this QR with Google Pay, PhonePe, or Paytm to pay ₹{amount}</p>
      <button
        onClick={handlePaymentSuccess}
        className="payment-button gpay-button"
        disabled={loading}
      >
        {loading ? "Processing..." : "I’ve Paid"}
      </button>
    </div>
  );
}

export default PaytmButton;

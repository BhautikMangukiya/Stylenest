// src/components/PaytmButton.jsx
import React from "react";
import QRCode from "react-qr-code";
import "./PaytmButton.css";

function PaytmButton({ amount, onPaymentSuccess }) {
  const upiLink = `upi://pay?pa=8780341577@pytes&pn=Your%20Name&am=${amount}&cu=INR`;

  return (
    <div className="qr-section">
      <h3>Pay with Paytm or any UPI App</h3>
      <QRCode
        value={upiLink}
        size={200}
        style={{ height: "auto", maxWidth: "100%", width: "200px" }}
      />
      <p>Scan this QR with Google Pay, PhonePe, or Paytm to pay ₹{amount}</p>
      <button onClick={onPaymentSuccess} className="payment-button gpay-button">
        I’ve Paid
      </button>
    </div>
  );
}

export default PaytmButton;

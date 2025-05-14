import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PaypalButton({ amount, onSuccess, onError }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AZhbv7vCylASPqYNHH4TIQa4MPKIZvnGohjI8PIL66E19b91KTh-AbCgawCdVmVVRGnuD-nPNvM5hvyR",
      }}
    >
      <PayPalButtons 
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalButton;

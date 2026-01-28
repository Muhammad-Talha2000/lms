import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentModal = ({ isOpen, onClose, actionType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Call your backend to create a PaymentIntent
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: actionType, amount: 1200 }), // Amount in smallest currency unit
    });
    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
      alert("Payment Failed: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment Successful!");
      onClose();
    }

    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{actionType} Payment</h2>
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="submit-button"
          >
            {isProcessing ? "Processing..." : `Pay Rs. 12`}
          </button>
        </form>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProceedToPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount, paymentMethod, shippingAddress } =
    location.state || {};

  if (!cartItems || cartItems.length === 0) {
    navigate("/"); // Redirect if no cart data
    return null;
  }

  const handlePayment = () => {
    alert("Payment successful!");
    localStorage.removeItem("cartItems"); // Clear cart after successful payment
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Payment</h2>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <p className="mb-2">Shipping Address: {shippingAddress}</p>
        <p className="mb-2">Payment Method: {paymentMethod}</p>
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name}
                {item.quantity > 1 && ` (x${item.quantity})`}
              </span>
              <span>
                ${item.price.toFixed(2)}
                {item.quantity > 1 &&
                  ` × ${item.quantity} = $${(
                    item.price * item.quantity
                  ).toFixed(2)}`}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-4 font-semibold">Total: ${totalAmount}</div>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default ProceedToPayment;

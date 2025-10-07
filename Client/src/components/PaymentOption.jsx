import React, { useState } from "react";
import axios from "axios";

const PaymentOptions = ({ order }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (method) => {
    setLoading(true);
    const tx_ref = `${method.toUpperCase()}-${Date.now()}`;

    try {
      const endpoint =
        method === "chapa"
          ? "/api/chapa/initialize"
          : "/api/telebirr/initialize";

      const { data } = await axios.post(endpoint, {
        tx_ref,
        amount: order.amount,
        first_name: order.firstName,
        last_name: order.lastName,
        email: order.email,
        phone_number: order.phone,
      });

      const redirectUrl = data.paymentUrl || data.data?.checkout_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert("Payment initialization failed. No redirect URL found.");
      }
    } catch (error) {
      console.error("❌ Payment Init Error:", error);
      alert("Payment failed to initialize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      <h2 className="text-xl font-semibold">Choose Payment Method</h2>

      <button
        onClick={() => handlePayment("chapa")}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Chapa"}
      </button>

      <button
        onClick={() => handlePayment("telebirr")}
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Telebirr"}
      </button>
    </div>
  );
};

export default PaymentOptions;

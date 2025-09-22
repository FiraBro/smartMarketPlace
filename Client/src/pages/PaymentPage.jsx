// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../service/orderService";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePay = () => {
    // Here you’d integrate Stripe, PayPal, etc.
    alert("Payment successful! 🎉");
    navigate("/orders"); // Redirect to order history
  };

  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Payment for Order</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-3">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status || "Pending"}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.payment || "Not set"}
        </p>
        <h3 className="font-medium mt-4">Products:</h3>
        <ul className="list-disc ml-6">
          {order.products.map((p) => (
            <li key={p._id}>
              {p.product?.title || "Unknown"} × {p.quantity}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePay}
        className="mt-6 w-full py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-500 transition"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;

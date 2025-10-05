// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  payWithCOD,
  payWithTeleBirr,
  getOrderById,
} from "../service/orderService";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaMobileAlt, FaBoxOpen } from "react-icons/fa";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  const handlePayment = async () => {
    if (!order) return;
    setPaymentLoading(true);
    try {
      if (order.paymentMethod === "COD") {
        await payWithCOD(order._id);
        alert("Cash on Delivery selected. Order confirmed!");
      } else if (order.paymentMethod === "TeleBirr") {
        const phone = prompt("Enter your TeleBirr phone number:");
        if (!phone) throw new Error("Phone number is required for TeleBirr");
        const data = await payWithTeleBirr(order._id, phone);
        window.open(data.paymentUrl, "_blank");
      }
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading order details...
      </div>
    );

  if (!order)
    return <div className="p-6 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Complete Your Payment
        </h1>

        {/* Order Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Order ID:</span>{" "}
              <span className="font-mono text-blue-600">{order._id}</span>
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Status:</span>{" "}
              {order.status || "Pending"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total:</span> $
              {order.totalPrice?.toFixed(2) || "0.00"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="font-semibold text-gray-700 mb-2">Payment Method:</p>
            <div className="flex items-center gap-3 text-lg">
              {order.paymentMethod === "TeleBirr" ? (
                <>
                  <FaMobileAlt className="text-amber-500" />
                  <span className="text-gray-800 font-medium">TeleBirr</span>
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="text-green-600" />
                  <span className="text-gray-800 font-medium">
                    Cash on Delivery
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaBoxOpen className="text-blue-500" /> Ordered Products
          </h3>
          <ul className="space-y-2 text-gray-700">
            {order.products.map((p) => (
              <li
                key={p._id}
                className="flex justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
              >
                <span>{p.product?.title || "Unknown Product"}</span>
                <span className="text-gray-600">× {p.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl shadow-lg hover:from-green-500 hover:to-green-400 transition-all font-semibold text-lg"
        >
          {paymentLoading ? "Processing..." : "Confirm & Pay"}
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentPage;

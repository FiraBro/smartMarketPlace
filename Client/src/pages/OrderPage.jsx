// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { getOrders } from "../service/orderService";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log(data)
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (orders.length === 0) return <p className="p-6">No orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Status:</strong> {order.status || "Pending"}
              </p>
              <p>
                <strong>Total Items:</strong> {order.products.length}
              </p>
            </div>
            <Link
              to={`/payment/${order._id}`}
              className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              View / Pay
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

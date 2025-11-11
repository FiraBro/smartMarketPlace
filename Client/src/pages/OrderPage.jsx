import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyOrders,
  cancelOrder,
  confirmDelivery,
} from "../service/orderService";
import ProductStatusBadge from "../components/ProductStatusBadge";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = (orderId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to cancel this order?</p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={async () => {
                toast.dismiss(t.id);
                setProcessing(orderId);
                try {
                  await cancelOrder(orderId);
                  setOrders((prev) =>
                    prev.filter((order) => order._id !== orderId)
                  );
                  toast.success("Order cancelled successfully!");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to cancel the order. Please try again.");
                } finally {
                  setProcessing(null);
                }
              }}
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleConfirmDelivery = async (orderId, productId) => {
    setProcessing(`${orderId}-${productId}`);
    try {
      await confirmDelivery(orderId, productId);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                products: order.products.map((p) =>
                  p._id === productId ? { ...p, status: "Completed" } : p
                ),
              }
            : order
        )
      );
      toast.success("✅ Delivery confirmed! Admin will release funds soon.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm delivery.");
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading your orders...
      </p>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="text-[#000] p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No orders"
            className="w-40 mb-4 opacity-70"
          />
          <p className="text-gray-500 text-lg">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/"
            className="mt-4 bg-[#f9A03f] text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="from-orange-50 bg-gradient-to-r via-white to-orange-100 text-gray-800 p-10 rounded-lg shadow mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
          <thead className="bg-orange-100 text-gray-800 text-left">
            <tr>
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Total Price</th>
              <th className="py-3 px-6">Delivery Method</th>
              <th className="py-3 px-6 text-center">Products</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <>
                <tr
                  key={order._id}
                  className="hover:bg-orange-50 transition cursor-pointer"
                  onClick={() =>
                    setExpanded(expanded === order._id ? null : order._id)
                  }
                >
                  <td className="py-4 px-6 font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="py-4 px-6">${order.totalPrice}</td>
                  <td className="py-4 px-6">{order.deliveryMethod || "N/A"}</td>
                  <td className="py-4 px-6 text-center">
                    {order.products?.length || 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <ProductStatusBadge
                      status={
                        order.status ||
                        order.products[0]?.status ||
                        "Processing"
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-center flex flex-col md:flex-row gap-2 justify-center">
                    <Link
                      to={`/orders/${order._id}`}
                      className="bg-[#f9A03f] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-500 transition"
                    >
                      View
                    </Link>
                    {order.status !== "Cancelled" &&
                      order.status !== "Delivered" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order._id);
                          }}
                          disabled={processing === order._id}
                          className={`text-white text-sm px-3 py-1.5 rounded-lg transition ${
                            processing === order._id
                              ? "bg-gray-400"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {processing === order._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                  </td>
                </tr>

                {/* Expanded Product Details */}
                {expanded === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-2 px-4 text-left">Product</th>
                              <th className="py-2 px-4 text-center">Qty</th>
                              <th className="py-2 px-4 text-center">Price</th>
                              <th className="py-2 px-4 text-center">Status</th>
                              <th className="py-2 px-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((p) => (
                              <tr
                                key={p._id}
                                className="border-b last:border-0 hover:bg-orange-50 transition"
                              >
                                <td className="py-2 px-4 font-medium text-gray-900">
                                  {p.productId?.title || "Unknown Product"}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {p.quantity}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  ${p.price * p.quantity}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <ProductStatusBadge status={p.status} />
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {p.status === "Shipped" && (
                                    <button
                                      onClick={() =>
                                        handleConfirmDelivery(order._id, p._id)
                                      }
                                      disabled={
                                        processing === `${order._id}-${p._id}`
                                      }
                                      className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700 transition"
                                    >
                                      {processing === `${order._id}-${p._id}`
                                        ? "Processing..."
                                        : "Confirm Received"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;

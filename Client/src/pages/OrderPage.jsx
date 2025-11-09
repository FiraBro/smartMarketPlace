import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../service/orderService";
import ProductStatusBadge from "../components/ProductStatusBadge";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

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
                setCancelling(orderId);

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
                  setCancelling(null);
                }
              }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-[#f9A03f] text-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order #{order._id}
              </h2>
              <p className="text-gray-600">
                Total Price:{" "}
                <span className="font-medium">${order.totalPrice}</span>
              </p>
              <p className="text-gray-600">
                Delivery Method:{" "}
                <span className="font-medium">
                  {order.deliveryMethod || "N/A"}
                </span>
              </p>

              {/* Products */}
              <div className="mt-3 space-y-2">
                {order.products?.length > 0 ? (
                  order.products.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {p.productId?.title || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {p.quantity} • Price: ${p.price * p.quantity}
                        </p>
                      </div>
                      <ProductStatusBadge status={p.status} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No products found
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <Link
                to={`/orders/${order._id}`}
                className="bg-[#f9A03f] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-orange-500 transition duration-300"
              >
                View Details
              </Link>

              {/* Cancel button only if not already cancelled or delivered */}
              {order.status !== "Cancelled" && order.status !== "Delivered" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={cancelling === order._id}
                  className={`${
                    cancelling === order._id
                      ? "bg-gray-400"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-2 rounded-lg font-medium shadow transition duration-300`}
                >
                  {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

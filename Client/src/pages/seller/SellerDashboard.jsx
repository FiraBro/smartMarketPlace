import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "../../components/seller/StatCard";
import StatusDropdown from "../../components/StatusDropdown";
import {
  FaBox,
  FaDollarSign,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import {
  getRecentOrder,
  updateOrderStatus,
  getSellerProducts,
} from "../../service/sellerService";

export default function SellerDashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Stats
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent orders
        const ordersData = await getRecentOrder();
        const formattedOrders =
          ordersData?.map((order) => ({
            id: order._id,
            product: order.products.map((p) => p.product.title).join(", "),
            status: order.products.map((p) => p.status).join(", "),
            totalAmount: order.products.reduce(
              (sum, p) => sum + p.product.price,
              0
            ),
            totalProducts: order.products.length,
          })) || [];

        setOrders(formattedOrders);

        // Fetch products
        const productsData = await getSellerProducts();
        setProducts(productsData || []);

        // Calculate stats
        const sales = formattedOrders.reduce(
          (sum, o) => sum + o.totalAmount,
          0
        );
        const totalProductsCount = productsData?.length || 0;

        setTotalSales(sales);
        setTotalProducts(totalProductsCount);

        // Calculate growth (compare with previous period or last month)
        // For demo, let's assume previous sales is stored or fetched
        const previousSales = 10000; // Replace with real previous sales from backend
        const growthPercentage = previousSales
          ? ((sales - previousSales) / previousSales) * 100
          : 0;
        setGrowth(growthPercentage.toFixed(1));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    try {
      await updateOrderStatus(selectedOrder.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-indigo-100/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 shadow-sm border border-indigo-100"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-indigo-800">
                Welcome back, John!
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Here’s your business overview today.
              </p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Sales"
              value={`$${totalSales}`}
              icon={<FaDollarSign />}
              delay={0.1}
            />
            <StatCard
              title="Orders"
              value={orders.length}
              icon={<FaClipboardList />}
              delay={0.2}
            />
            <StatCard
              title="Products"
              value={totalProducts}
              icon={<FaBox />}
              delay={0.3}
            />
            <StatCard
              title="Growth"
              value={`${growth}%`}
              icon={<FaChartLine />}
              delay={0.4}
            />
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Recent Orders
            </h3>
            <div className="min-w-[500px] md:min-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-gray-100">
                    <th className="py-2 px-2 sm:px-4">Order ID</th>
                    <th className="py-2 px-2 sm:px-4">Product</th>
                    <th className="py-2 px-2 sm:px-4">Status</th>
                    <th className="py-2 px-2 sm:px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(order)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-2 px-2 sm:px-4 text-gray-700">
                        {order.id}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-gray-700">
                        {order.product}
                      </td>
                      <td className="py-2 px-2 sm:px-4">
                        <span
                          className={`font-medium text-xs px-2 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "text-green-600 bg-green-50"
                              : "text-yellow-600 bg-yellow-50"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-gray-700">
                        ${order.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-xl p-6 w-80 sm:w-96 border border-gray-100"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Update Order Status
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Order ID:{" "}
                    <span className="font-medium">{selectedOrder?.id}</span>
                  </p>

                  <StatusDropdown value={status} onChange={setStatus} />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveStatus}
                      className="px-4 py-2 bg-[#f9A03f] text-white rounded-lg text-sm font-medium hover:bg-[#faa64d]"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import StatCard from "../../components/seller/StatCard";
import {
  FaBox,
  FaDollarSign,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";

export default function SellerDashboard() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-indigo-50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 shadow-md"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
                Welcome back, John!
              </h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Here’s your business overview today.
              </p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Sales"
              value="$12,300"
              icon={<FaDollarSign />}
              delay={0.1}
            />
            <StatCard
              title="Orders"
              value="142"
              icon={<FaClipboardList />}
              delay={0.2}
            />
            <StatCard
              title="Products"
              value="56"
              icon={<FaBox />}
              delay={0.3}
            />
            <StatCard
              title="Growth"
              value="+12%"
              icon={<FaChartLine />}
              delay={0.4}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Recent Orders
            </h3>
            <div className="min-w-[500px] md:min-w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm border-b">
                    <th className="py-2 px-2 sm:px-4">Order ID</th>
                    <th className="py-2 px-2 sm:px-4">Product</th>
                    <th className="py-2 px-2 sm:px-4">Status</th>
                    <th className="py-2 px-2 sm:px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4">#4521</td>
                    <td className="py-2 px-2 sm:px-4">Nike Air Max</td>
                    <td className="py-2 px-2 sm:px-4">
                      <span className="text-green-600 font-medium">
                        Delivered
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-4">$120</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4">#4522</td>
                    <td className="py-2 px-2 sm:px-4">Adidas UltraBoost</td>
                    <td className="py-2 px-2 sm:px-4">
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-4">$90</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

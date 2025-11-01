import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaShoppingCart,
  FaCreditCard,
  FaUserPlus,
  FaListAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const steps = {
  buyer: [
    { icon: <FaSearch />, title: "Browse Products", desc: "Explore thousands of products from verified sellers." },
    { icon: <FaShoppingCart />, title: "Add to Cart", desc: "Add your favorite products to the cart easily." },
    { icon: <FaCreditCard />, title: "Checkout Securely", desc: "Pay safely using trusted payment gateways." },
  ],
  seller: [
    { icon: <FaUserPlus />, title: "Register as Seller", desc: "Create your seller account in minutes." },
    { icon: <FaListAlt />, title: "List Your Products", desc: "Upload products and manage your inventory." },
    { icon: <FaMoneyBillWave />, title: "Start Earning", desc: "Sell to buyers and withdraw your earnings anytime." },
  ],
};

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("buyer");

  return (
    <section className="py-16 bg-[#FFF]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">How It Works</h2>
        <p className="text-gray-600 mb-10">Simple steps for both Buyers and Sellers</p>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("buyer")}
            className={`px-6 py-2 rounded-full font-medium transition border ${
              activeTab === "buyer"
                ? "bg-[#F9A03F] text-white border-[#F9A03F]"
                : "bg-white text-gray-700 border-[#F2C999] hover:bg-[#FFF4E6]"
            }`}
          >
            For Buyers
          </button>

          <button
            onClick={() => setActiveTab("seller")}
            className={`px-6 py-2 rounded-full font-medium transition border ${
              activeTab === "seller"
                ? "bg-[#F9A03F] text-white border-[#F9A03F]"
                : "bg-white text-gray-700 border-[#F2C999] hover:bg-[#FFF4E6]"
            }`}
          >
            For Sellers
          </button>
        </div>

        {/* Animated Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps[activeTab].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center border border-[#F2C999]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="text-4xl text-[#F9A03F] mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

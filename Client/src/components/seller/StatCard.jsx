// components/seller/StatCard.jsx
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon, delay }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition"
    >
      <div className="text-[#111111] text-3xl">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}

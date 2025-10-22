// components/seller/ProductCard.jsx
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg truncate">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{product.category}</p>
        <p className="text-indigo-600 font-bold mt-2">${product.price}</p>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

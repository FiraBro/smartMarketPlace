import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Nike Air Max",
      category: "Shoes",
      price: 120,
      image: "https://images.unsplash.com/photo-1606813902784-4b8d4f3f8a3c",
    },
    {
      id: 2,
      name: "Adidas Hoodie",
      category: "Clothing",
      price: 60,
      image: "https://images.unsplash.com/photo-1602810315611-ef9e4f6e9a6f",
    },
  ]);

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/seller/edit-product/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Your Products</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/seller/add-product")}
          className="flex items-center gap-2 bg-[#f9A03f] text-white px-4 py-2 rounded-lg hover:bg-[#faa64d] cursor-pointer transition"
        >
          <FaPlus /> Add Product
        </motion.button>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No products added yet.
        </p>
      ) : (
        <div className="overflow-x-auto w-full">
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr className="text-gray-600 text-sm">
                <th className="py-3 px-4 text-left w-[15%]">Image</th>
                <th className="py-3 px-4 text-left w-[25%]">Name</th>
                <th className="py-3 px-4 text-left w-[20%]">Category</th>
                <th className="py-3 px-4 text-left w-[15%]">Price</th>
                <th className="py-3 px-4 text-left w-[25%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: product.id * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-semibold">
                    ${product.price}
                  </td>
                  <td className="py-3 px-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}

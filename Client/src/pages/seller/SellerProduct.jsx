import { useState } from "react";
import { motion } from "framer-motion";
import AddProductModal from "../../components/seller/AddProductModal";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function SellerProducts() {
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
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Your Products</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-md min-w-[600px]">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-sm border-b">
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: product.id * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4 text-indigo-600 font-semibold">
                    ${product.price}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}

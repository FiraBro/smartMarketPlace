import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSellerProducts, deleteProduct } from "../../service/sellerService";
import { toast } from "react-toastify";

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getSellerProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
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
      {loading ? (
        <p className="text-gray-500 text-center mt-20">Loading products...</p>
      ) : products.length === 0 ? (
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
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.images?.[0] || ""}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {product.title}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-semibold">
                    ${product.price}
                  </td>
                  <td className="py-3 px-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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

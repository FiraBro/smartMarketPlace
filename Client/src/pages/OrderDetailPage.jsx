import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getOrderById,
  uploadPaymentProof,
  confirmDelivery,
} from "../service/orderService";
import ProductStatusBadge from "../components/ProductStatusBadge";

const OrderDetailPage = () => {
  const { id } = useParams(); // orderId
  const [order, setOrder] = useState(null);
  const [fileMap, setFileMap] = useState({});
  const [transactionMap, setTransactionMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details.");
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpload = async (productId) => {
    const file = fileMap[productId];
    const transactionId = transactionMap[productId];
    if (!file) return toast.error("Please select a file!");
    if (!transactionId) return toast.error("Please enter transaction ID!");

    setLoadingMap((prev) => ({ ...prev, [productId]: true }));
    try {
      const data = await uploadPaymentProof(id, productId, file, transactionId);
      setOrder((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.productId._id === productId ? data.product : p
        ),
      }));
      setFileMap((prev) => ({ ...prev, [productId]: null }));
      setTransactionMap((prev) => ({ ...prev, [productId]: "" }));
      toast.success("Payment proof uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload payment proof.");
    }
    setLoadingMap((prev) => ({ ...prev, [productId]: false }));
  };

  const handleConfirmDelivery = async (productId) => {
    setLoadingMap((prev) => ({ ...prev, [productId]: true }));
    try {
      await confirmDelivery(id, productId);
      setOrder((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.productId._id === productId ? { ...p, status: "completed" } : p
        ),
      }));
      toast.success("Delivery confirmed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm delivery.");
    }
    setLoadingMap((prev) => ({ ...prev, [productId]: false }));
  };

  if (!order)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading order details...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-white to-orange-100 text-gray-800 p-8 rounded-2xl shadow-lg mb-10 border border-orange-200">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-wall-3.png')] opacity-10"></div>

        <div className="relative z-10">
          <h1 className="text-sm font-medium text-orange-600 tracking-wide">
            CBE Account Number:{" "}
            <span className="font-semibold">1000434384277</span>
          </h1>

          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Order #{order._id}
          </h2>

          <div className="mt-5 space-y-2 text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Total Price:</span>{" "}
              <span className="text-orange-600 font-bold">
                ${order.totalPrice}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Delivery Method:
              </span>{" "}
              <span className="text-orange-600 font-semibold">
                {order.deliveryMethod}
              </span>
            </p>
            {order.address && (
              <p>
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                <span className="text-orange-600 font-medium">
                  {order.address}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-orange-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Seller</th>
              <th className="px-6 py-3 text-center">Qty</th>
              <th className="px-6 py-3 text-center">Price</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.products.map((product) => {
              const loading = loadingMap[product.productId._id];
              return (
                <tr key={product._id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {product.productId?.title || "Unknown Product"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {product.sellerId}
                  </td>
                  <td className="px-6 py-4 text-center">{product.quantity}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">
                    ${product.price * product.quantity}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.paymentProof && (
                      <a
                        href={product.paymentProof.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm underline block mb-1"
                      >
                        View Proof
                      </a>
                    )}

                    {(product.status === "pending" ||
                      product.status === "payment_submitted") && (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Transaction ID"
                          value={transactionMap[product.productId._id] || ""}
                          onChange={(e) =>
                            setTransactionMap((prev) => ({
                              ...prev,
                              [product.productId._id]: e.target.value,
                            }))
                          }
                          className="border border-orange-400 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-orange-400 disabled:bg-gray-100"
                          disabled={loading}
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            setFileMap((prev) => ({
                              ...prev,
                              [product.productId._id]: e.target.files[0],
                            }))
                          }
                          className="border border-orange-400 rounded-lg px-2 py-1 text-sm"
                          disabled={loading}
                        />
                        <button
                          className={`bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg shadow hover:bg-orange-600 transition ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleUpload(product.productId._id)}
                          disabled={loading}
                        >
                          {loading ? "Uploading..." : "Upload Proof"}
                        </button>
                      </div>
                    )}

                    {product.status === "shipped" && (
                      <button
                        className={`bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg shadow hover:bg-green-600 transition ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() =>
                          handleConfirmDelivery(product.productId._id)
                        }
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Confirm Delivery"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;

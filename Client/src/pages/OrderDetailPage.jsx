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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#f9A03f] text-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-lg font-medium">
          CBE Account Number: 1000434384277
        </h1>
        <h2 className="text-3xl font-bold mt-2">Order #{order._id}</h2>
        <div className="mt-4 space-y-1">
          <p>
            Total Price:{" "}
            <span className="font-semibold">${order.totalPrice}</span>
          </p>
          <p>
            Delivery Method:{" "}
            <span className="font-semibold">{order.deliveryMethod}</span>
          </p>
          {order.address && (
            <p>
              Address: <span className="font-semibold">{order.address}</span>
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="space-y-6">
        {order.products.map((product) => {
          const loading = loadingMap[product.productId._id];
          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-4 shadow hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {product.productId?.title || "Unknown Product"}
                </h2>
                <p className="text-gray-500 mt-1">
                  Seller:{" "}
                  <span className="font-medium">{product.sellerId}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Quantity:{" "}
                  <span className="font-medium">{product.quantity}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Price:{" "}
                  <span className="font-medium">
                    ${product.price * product.quantity}
                  </span>
                </p>

                <div className="mt-3">
                  <ProductStatusBadge status={product.status} />
                </div>

                {product.paymentProof && (
                  <p className="text-green-600 mt-2 text-sm">
                    Payment proof uploaded:{" "}
                    <a
                      href={product.paymentProof.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-800"
                    >
                      View
                    </a>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-64 mt-4 md:mt-0">
                {(product.status === "pending" ||
                  product.status === "payment_submitted") && (
                  <>
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
                      className="border border-[#f9A03f] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f9A03f] disabled:bg-gray-100"
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
                      className="border border-[#f9A03f] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f9A03f] disabled:bg-gray-100"
                      disabled={loading}
                    />
                    <button
                      className={`bg-[#f9A03f] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-orange-500 transition duration-300 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleUpload(product.productId._id)}
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload Payment Proof"}
                    </button>
                  </>
                )}

                {product.status === "shipped" && (
                  <button
                    className={`bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-600 transition duration-300 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleConfirmDelivery(product.productId._id)}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm Delivery"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetailPage;

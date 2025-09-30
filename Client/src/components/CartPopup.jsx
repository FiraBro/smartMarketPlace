import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { createOrder } from "../service/orderService";
import { getAddresses } from "../service/addressService"; // fetch addresses from backend
import { useNavigate } from "react-router-dom";

const CartPopup = ({ isOpen, onClose, onCheckout }) => {
  const { cart, addItem, removeItem, clear } = useCart();
  console.log(cart)
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log(addresses);
  const navigate = useNavigate();

  // Fetch addresses from backend on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]); // default first address
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  // Calculate totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cart.length > 0 ? 10 : 0;
  const discount = subtotal > 100 ? 15 : 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address before checkout.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder({
        products: cart.map((item) => ({
          product: item._id || item.id,
          quantity: item.quantity,
        })),
        address: selectedAddress,
        payment,
        total,
      });

      onCheckout(order); // parent callback (navigate or refresh orders)
      clear(); // clear cart after successful checkout
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to place order");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col rounded-l-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-b-amber-100">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <div className="flex items-center gap-3">
                {cart.length > 0 && (
                  <button
                    onClick={clear}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                  aria-label="Close cart"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              {cart.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500 text-lg">Your cart is empty 🛒</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                  {/* Items */}
                  <div className="space-y-4 overflow-y-auto pr-2 max-h-[70vh]">
                    {cart.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
                      >
                        <div className="flex-shrink-0 w-16 h-16">
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">${item.price}</p>

                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() =>
                                item.quantity > 1
                                  ? addItem(item, -1)
                                  : removeItem(item._id || item.id)
                              }
                              className="px-2 py-1 border rounded"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => addItem(item, 1)}
                              className="px-2 py-1 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item._id || item.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col gap-4 bg-gray-50 p-5 rounded-xl shadow-md max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Order Summary
                    </h3>

                    {/* Delivery Address */}
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Delivery Address
                      </span>
                      <div className="space-y-2 mt-2">
                        {addresses.length === 0 && (
                          <button
                            onClick={() => navigate("/address")}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Add Address
                          </button>
                        )}

                        {addresses.map((addr) => (
                          <label
                            key={addr._id}
                            className="block cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="address"
                              value={addr._id}
                              checked={selectedAddress?._id === addr._id}
                              onChange={() => setSelectedAddress(addr)}
                              className="mr-2"
                            />
                            {addr.street}, {addr.city}, {addr.country}
                          </label>
                        ))}

                        {selectedAddress && (
                          <p className="text-sm text-gray-600 bg-white p-2 rounded mt-1">
                            {selectedAddress.street}, {selectedAddress.city},{" "}
                            {selectedAddress.state} {selectedAddress.zip},{" "}
                            {selectedAddress.country} ({selectedAddress.phone})
                          </p>
                        )}

                        <button
                          onClick={() => navigate("/address")}
                          className="text-blue-600 hover:underline text-sm mt-1"
                        >
                          Manage Addresses
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Payment Method
                      </span>
                      <div className="space-y-2">
                        {["card", "paypal", "cod"].map((method) => (
                          <label
                            key={method}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method}
                              checked={payment === method}
                              onChange={() => setPayment(method)}
                            />
                            <span>
                              {method === "card"
                                ? "Credit / Debit Card"
                                : method === "paypal"
                                ? "PayPal"
                                : "Cash on Delivery"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>- ${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout */}
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className={`w-full py-3 bg-amber-600 text-white rounded-xl shadow hover:bg-amber-500 transition text-sm sm:text-base ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;

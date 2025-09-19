import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const CartPopup = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeItem, clear } = useCart();
  const [payment, setPayment] = useState("card");

  // Example: fetch saved address from localStorage
  const savedAddress = localStorage.getItem("deliveryAddress");

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cart.length > 0 ? 10 : 0;
  const discount = subtotal > 100 ? 15 : 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    if (!savedAddress) {
      alert("Please add a delivery address before checkout.");
      return;
    }
    onCheckout({ address: savedAddress, payment, total });
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
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <p></p>
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

            {/* Content: items + summary side by side */}
            <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
              {/* Items */}
              <div className="space-y-4 overflow-y-auto pr-2 max-h-[70vh]">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    Your cart is empty 🛒
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
                    >
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id || item.id)}
                        className="text-red-500 hover:text-red-600 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Order Summary */}
              {cart.length > 0 && (
                <div className="flex flex-col gap-4 bg-gray-50 p-5 rounded-xl shadow-md max-h-[70vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Order Summary
                  </h3>

                  {/* Address link */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Delivery Address
                    </span>
                    <a
                      href="/address"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {savedAddress ? "Change" : "Add"}
                    </a>
                  </div>
                  {savedAddress && (
                    <p className="text-sm text-gray-600 bg-white p-2 rounded">
                      {savedAddress}
                    </p>
                  )}

                  {/* Payment Method */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Payment Method
                    </span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={payment === "card"}
                          onChange={() => setPayment("card")}
                        />
                        <span>Credit / Debit Card</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={payment === "paypal"}
                          onChange={() => setPayment("paypal")}
                        />
                        <span>PayPal</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={payment === "cod"}
                          onChange={() => setPayment("cod")}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  {/* Summary Prices */}
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

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-amber-600 text-white rounded-xl shadow hover:bg-amber-500 transition text-sm sm:text-base cursor-pointer"
                  >
                    Place Order
                  </button>
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

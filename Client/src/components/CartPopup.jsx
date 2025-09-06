import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const CartPopup = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeItem, clear } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col rounded-l-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
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

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t flex flex-col gap-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;

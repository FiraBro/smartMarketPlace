import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const CartPopup = ({ isOpen, onClose, cartItems, onRemove, onCheckout }) => {
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
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close cart"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Items (scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!cartItems || cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  Your cart is empty 🛒
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems && cartItems.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    $
                    {cartItems
                      .reduce((acc, i) => acc + i.price * i.quantity, 0)
                      .toFixed(2)}
                  </span>
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

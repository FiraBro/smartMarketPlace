import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMinus,
  FiTruck,
  FiPlus,
  FiLock,
  FiTrash2,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../service/orderService";
import { getAddresses } from "../service/addressService";
import AddressModal from "./AddressModal";

const CartPopup = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clear } =
    useCart();
  console.log("ccccccccccccccccccccccc", cart);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");

  const popupRef = useRef(null);

  const SHIPPING_COST = 10;
  const TAX_RATE = 0.07;

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById("address-modal");
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        (!modal || !modal.contains(event.target))
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };
    fetchAddresses();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (deliveryOption !== "pickup" && !selectedAddress?._id)
      return alert("Please select a delivery address.");

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = deliveryOption === "pickup" ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shippingCost + tax;

    try {
      setLoading(true);
      const orderPayload = {
        products: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        address: deliveryOption !== "pickup" ? selectedAddress._id : null,
        totalPrice: total,
        deliveryMethod: deliveryOption,
      };

      await createOrder(orderPayload);
      clear();
      onClose();
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = deliveryOption === "pickup" ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Cart Panel */}
          <motion.div
            ref={popupRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed bottom-0 left-0 w-full max-h-[90vh] bg-white z-50 rounded-t-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Shopping Cart ({cart.length})
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {cart.length > 0 && (
                  <button
                    onClick={clear}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
              {/* Product List */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 bg-gray-50 p-4 rounded-xl">
                {cart.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="w-28 h-28 mb-6 flex items-center justify-center bg-gray-100 rounded-full shadow-inner">
                      <FiShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Your Cart is Empty
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-xs">
                      Looks like you haven’t added anything yet. Start exploring
                      and fill your cart with products you’ll love!
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/all-listings");
                      }}
                      className="px-6 py-3 bg-[#f9A03f] text-white rounded-xl hover:bg-[#faa64d] transition-all cursor-pointer font-medium shadow-md"
                    >
                      Start Shopping
                    </button>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-start justify-between gap-4 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        {item.stock < 10 && (
                          <p className="text-xs text-orange-600">
                            Only {item.stock} left in stock
                          </p>
                        )}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item)}
                            disabled={item.quantity >= (item.stock || 10)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Order Summary */}
              {cart.length > 0 && (
                <div className="w-full md:w-96 flex flex-col bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">
                      Order Summary
                    </h3>

                    {/* Delivery Options */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FiTruck className="w-4 h-4" /> Delivery Method
                      </div>

                      {["delivery", "pickup"].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            deliveryOption === option
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value={option}
                            checked={deliveryOption === option}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                            className="text-[#f9A03f] focus:ring-[#faa64d]"
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>

                    {/* Address */}
                    {deliveryOption !== "pickup" && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">
                          Delivery Address
                        </span>
                        {selectedAddress ? (
                          <div className="p-3 bg-gray-50 rounded-lg mt-2 flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedAddress.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {selectedAddress.street}, {selectedAddress.city}
                                , {selectedAddress.state}{" "}
                                {selectedAddress.zipCode}
                              </p>
                            </div>
                            <button
                              onClick={() => setAddingAddress(true)}
                              className="text-[#f9A03f] hover:text-[#faa64d] cursor-pointer text-sm font-medium"
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingAddress(true)}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors text-left mt-2"
                          >
                            + Add Delivery Address
                          </button>
                        )}
                      </div>
                    )}

                    {/* Price Summary */}
                    <div className="mb-4 bg-gray-50 p-4 rounded-xl shadow-inner space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>
                          {shippingCost === 0
                            ? "Free"
                            : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className="w-full py-4 bg-[#f9A03f] text-white rounded-xl font-semibold hover:bg-[#faa64d] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiLock className="w-4 h-4" />
                        Proceed to Checkout • ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Address Modal */}
          {addingAddress && (
            <AddressModal
              onSave={(newAddr) => {
                setAddresses([newAddr]);
                setSelectedAddress(newAddr);
                setAddingAddress(false);
              }}
              onCancel={() => setAddingAddress(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../service/orderService";
import { getAddresses } from "../service/addressService";
import AddressModal from "./AddressModal";
import {
  initializeChapaPayment,
  initializeTelebirrPayment,
} from "../service/paymentService";

const CartPopup = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clear } =
    useCart();
  console.log(cart);
  const navigate = useNavigate();

  const [payment, setPayment] = useState("COD"); // COD, Telebirr, Chapa
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (deliveryMethod === "pickup") setSelectedAddress(null);
    else if (addresses.length > 0) setSelectedAddress(addresses[0]);
  }, [deliveryMethod, addresses]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = deliveryMethod === "delivery" && cart.length > 0 ? 10 : 0;
  const discount = subtotal > 100 ? 15 : 0;
  const total = subtotal + shipping - discount;

  // 🔥 Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (deliveryMethod === "delivery" && !selectedAddress?._id)
      return alert("Please select a delivery address.");

    try {
      setLoading(true);

      // 1️⃣ Create order in backend
      const orderData = {
        products: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        address: deliveryMethod === "delivery" ? selectedAddress._id : null,
        paymentMethod: payment,
        totalPrice: total,
        deliveryMethod,
      };

      const order = await createOrder(orderData);

      // 2️⃣ Payment Integration
      const tx_ref = `${payment.toUpperCase()}-${Date.now()}`;

      if (payment === "Telebirr") {
        const redirectUrl = await initializeTelebirrPayment({
          amount: total,
          first_name: order.customerFirstName,
          last_name: order.customerLastName,
          phone_number: order.customerPhone,
          tx_ref,
        });
        if (redirectUrl) window.location.href = redirectUrl;
        return;
      }

      if (payment === "Chapa") {
        const data = await initializeChapaPayment({
          amount: total,
          first_name: order.customerFirstName,
          last_name: order.customerLastName,
          email: order.customerEmail,
          phone_number: order.customerPhone,
          tx_ref,
        });
        if (data?.checkout_url) window.location.href = data.checkout_url;
        return;
      }

      // 3️⃣ COD
      clear();
      onClose();
      navigate("/orders");
    } catch (err) {
      console.error("Order error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

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
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 p-4">
              {cart.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500 text-lg">Your cart is empty 🛒</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                  <div className="space-y-4 overflow-y-auto pr-2 max-h-[70vh]">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item)}
                            className="px-2 cursor-pointer border rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item)}
                            className="px-2 cursor-pointer border rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 cursor-pointer rounded-full transition"
                          >
                            <FaTrash className="w-4 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary & Payment */}
                  <div className="flex flex-col gap-4 bg-gray-50 p-5 rounded-xl shadow-md max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Order Summary
                    </h3>

                    {/* Delivery & Address */}
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Order Type
                      </span>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="delivery"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
                          />
                          Delivery
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="pickup"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => setDeliveryMethod("pickup")}
                          />
                          Pickup
                        </label>
                      </div>
                    </div>

                    {deliveryMethod === "delivery" && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Delivery Address
                        </span>
                        <div className="space-y-2 mt-2">
                          {addresses.length > 0 ? (
                            <>
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
                              <button
                                onClick={() => setAddingAddress(true)}
                                className="text-blue-500 hover:underline cursor-pointer text-sm mt-1"
                              >
                                Manage Addresses
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setAddingAddress(true)}
                              className="text-blue-500 hover:underline cursor-pointer text-sm mt-1"
                            >
                              Add Delivery Address
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Selection */}
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Payment Method
                      </span>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={payment === "COD"}
                            onChange={() => setPayment("COD")}
                          />
                          Cash on Delivery
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="Telebirr"
                            checked={payment === "Telebirr"}
                            onChange={() => setPayment("Telebirr")}
                          />
                          <img
                            src="/telebirr-logo.png"
                            alt="Telebirr"
                            className="w-12 h-5 object-contain"
                          />
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="Chapa"
                            checked={payment === "Chapa"}
                            onChange={() => setPayment("Chapa")}
                          />
                          <img
                            src="/chapa-logo.png"
                            alt="Chapa"
                            className="w-12 h-5 object-contain"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Order Prices */}
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
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

                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full py-3 bg-amber-600 text-white rounded-xl shadow hover:bg-amber-500 transition"
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

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

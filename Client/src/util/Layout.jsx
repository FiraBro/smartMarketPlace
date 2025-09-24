import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
import CartPopup from "../components/CartPopup";
import ProSpinner from "../components/Spinner"; 

export default function Layout({ openCart, openFav, favorites }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const closeCart = () => setIsCartOpen(false);

  // Checkout handler that creates order and navigates to payment page
  const handleCheckout = (order) => {
    setLoading(true); // ✅ show spinner before navigation
    setTimeout(() => {
      navigate("/orders");
      setLoading(false); // ✅ hide spinner after navigation
      closeCart();
    }, 1200); // simulate async delay (replace with API call)
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Spinner overlay */}
      {loading && <ProSpinner />}

      <Navbar
        openCart={() => setIsCartOpen(true)}
        openFav={openFav}
        favorites={favorites}
      />

      {/* Main content area */}
      <main className="flex-grow mt-10">
        <Outlet />
      </main>

      <Footer />

      {/* Cart popup inside router context */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

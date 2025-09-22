import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
import CartPopup from "../components/CartPopup";

export default function Layout({ openCart, openFav, favorites }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const closeCart = () => setIsCartOpen(false);

  // Checkout handler that creates order and navigates to payment page
  const handleCheckout = (order) => {
    // navigate(`/payment/${order._id}`);
    navigate("/orders");
    closeCart();
  };

  return (
    <div className="flex flex-col min-h-screen">
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

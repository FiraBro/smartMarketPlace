import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartPopup from "../components/CartPopup";
import FavoritePopup from "../components/FavoritePopup";
import { Footer } from "../components/Footer";

export default function Layout({
  openCart,
  openFav,
  isCartOpen,
  isFavOpen,
  closeCart,
  closeFav,
  onCheckout,
}) {
  return (
    <>
      <Navbar openCart={openCart} openFav={openFav} />

      {/* Main page content */}
      <Outlet />

      {/* Modals */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={onCheckout}
      />
      <FavoritePopup isOpen={isFavOpen} onClose={closeFav} />
      <Footer />
    </>
  );
}

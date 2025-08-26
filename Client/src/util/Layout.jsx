import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
export default function Layout({
  openCart,
  cartItems,
  total,
  openFav,
  favorites,
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        openCart={openCart}
        cartItems={cartItems}
        openFav={openFav}
        favorites={favorites}
      />

      {/* Main content area with margin top */}
      <main className="flex-grow mt-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

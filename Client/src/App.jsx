import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import CartPopup from "./components/CartPopup";
import FavoritePopup from "./components/FavoritePopup";

export default function App() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89,
      quantity: 2,
      image: "/img1.jpg",
    },
    { id: 2, name: "Smart Watch", price: 199, quantity: 1, image: "/img2.jpg" },
  ]);

  const [favorites, setFavorites] = useState([
    { id: 3, name: "Sneakers", price: 120, image: "/img3.jpg" },
    { id: 4, name: "Smartphone", price: 699, image: "/img4.jpg" },
    { id: 3, name: "Sneakers", price: 120, image: "/img3.jpg" },
    { id: 4, name: "Smartphone", price: 699, image: "/img4.jpg" },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const handleRemoveCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const handleRemoveFav = (id) =>
    setFavorites((prev) => prev.filter((i) => i.id !== id));

  const handleCheckout = () => {
    console.log("checkout");
    closeCart();
  };

  return (
    <div className="min-h-screen">
      <HomePage
        openCart={openCart}
        cartItems={cartItems}
        openFav={openFav}
        favorites={favorites}
      />

      <CartPopup
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemove={handleRemoveCart}
        onCheckout={handleCheckout}
      />

      <FavoritePopup
        isOpen={isFavOpen}
        onClose={closeFav}
        favorites={favorites}
        onRemove={handleRemoveFav}
      />
    </div>
  );
}

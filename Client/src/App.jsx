import React, { useMemo, useState } from "react";
import HomePage from "./pages/HomePage";
import CartPopup from "./components/CartPopup";

export default function App() {
  // Example cart items; replace with your real data/store.
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89,
      quantity: 2,
      image: "/img1.jpg",
    },
    { id: 2, name: "Smart Watch", price: 199, quantity: 1, image: "/img2.jpg" },
    { id: 3, name: "Sneakers", price: 120, quantity: 3, image: "/img3.jpg" },
    
    { id: 2, name: "Smart Watch", price: 199, quantity: 1, image: "/img2.jpg" },
    { id: 3, name: "Sneakers", price: 120, quantity: 3, image: "/img3.jpg" },
    
    { id: 2, name: "Smart Watch", price: 199, quantity: 1, image: "/img2.jpg" },
    { id: 3, name: "Sneakers", price: 120, quantity: 3, image: "/img3.jpg" },
    
    { id: 2, name: "Smart Watch", price: 199, quantity: 1, image: "/img2.jpg" },
    { id: 3, name: "Sneakers", price: 120, quantity: 3, image: "/img3.jpg" },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleRemove = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const handleCheckout = () => {
    // put your checkout navigation or API call here
    console.log("checkout");
    closeCart();
  };

  // You can compute totals here and pass down if needed
  const total = useMemo(
    () => cartItems.reduce((a, i) => a + i.price * i.quantity, 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen">
      {/* Pass openCart to pages or navbar so a cart icon can open it */}
      <HomePage openCart={openCart} cartItems={cartItems} total={total} />

      <CartPopup
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

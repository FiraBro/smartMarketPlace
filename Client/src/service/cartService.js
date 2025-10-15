import axios from "axios";

// ✅ Base API instance for cart endpoints (session-based)
const CART_API = axios.create({
  baseURL: import.meta.env.VITE_CART_URL || "http://localhost:5000/api/cart",
  withCredentials: true, // ✅ send cookies automatically
});

// ➕ Add item to cart
export const addToCart = async (listingId, quantity = 1) => {
  const { data } = await CART_API.post("/add", { listingId, quantity });
  return data;
};

// 🛒 Get user cart
export const getCart = async () => {
  const { data } = await CART_API.get("/");
  const items = data.items || [];

  return {
    items: items.map((item) => {
      const imagePath =
        item.listing?.images?.[0]?.url || item.listing?.images?.[0] || null;

      return {
        id: item.listing?._id || item.listing,
        name: item.listing?.title || "Unknown Item",
        price: item.listing?.price || 0,
        image: imagePath
          ? `${
              import.meta.env.VITE_STATIC_URL || "http://localhost:5000"
            }${imagePath}`
          : "https://via.placeholder.com/200",
        quantity: item.quantity,
      };
    }),
  };
};

// Update cart item
export const updateCartItem = async ({ listingId, quantity }) => {
  const { data } = await CART_API.put("/update", { listingId, quantity });
  return data;
};

// ❌ Remove item from cart
export const removeFromCart = async (listingId) => {
  const { data } = await CART_API.delete("/remove", { data: { listingId } });
  return data;
};

// 🧹 Clear all items from cart
export const clearCart = async () => {
  const { data } = await CART_API.delete("/clear");
  return data;
};

//
// ✅ Checkout + Payment Section (session-based)
//

const ORDER_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/orders",
  withCredentials: true, // ✅ session cookies
});

// Checkout cart → creates an order in backend
export const checkoutCart = async () => {
  const { data } = await ORDER_API.post("/");
  return data; // returns the new order
};

// Pay with Cash on Delivery
export const payWithCOD = async (orderId) => {
  const { data } = await axios.post(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/payments/cod`,
    { orderId },
    { withCredentials: true } // ✅ session cookies
  );
  return data;
};

// Pay with TeleBirr
export const payWithTeleBirr = async (orderId, phone) => {
  const { data } = await axios.post(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/payments/telebirr`,
    { orderId, phone },
    { withCredentials: true } // ✅ session cookies
  );
  return data; // contains { paymentUrl, order }
};

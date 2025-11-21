import Cart from "../models/Cart.js";
import Listing from "../models/Listing.js";
import AppError from "../utils/AppError.js";

/**
 * Get cart for a user
 */
export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.listing");
  return cart || { items: [] };
};

/**
 * Add listing to cart
 */
export const addToCartService = async (userId, listingId, quantity = 1) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found", 404);

  if (listing.owner.toString() === userId.toString()) {
    throw new AppError("You cannot add your own product to the cart", 400);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ listing: listingId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.listing.toString() === listingId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ listing: listingId, quantity });
    }
  }

  await cart.save();
  return cart;
};

/**
 * Update quantity of a listing in cart
 */
export const updateCartItemService = async (userId, listingId, quantity) => {
  if (quantity < 1) throw new AppError("Quantity must be at least 1", 400);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found", 404);

  const itemIndex = cart.items.findIndex(
    (item) => item.listing.toString() === listingId
  );
  if (itemIndex === -1) throw new AppError("Listing not in cart", 404);

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return cart;
};

/**
 * Remove a listing from cart
 */
export const removeFromCartService = async (userId, listingId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.listing.toString() !== listingId
  );
  await cart.save();
  return cart;
};

/**
 * Clear the cart
 */
export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = [];
  await cart.save();
  return cart;
};

import Cart from "../models/Cart.js";
import Listing from "../models/Listing.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Get the current user's cart
export const getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.listing"
  );
  if (!cart) {
    return res.json({ items: [] });
  }
  res.json(cart);
});

// Add a listing to the cart
export const addToCart = catchAsync(async (req, res, next) => {
  const { listingId, quantity = 1 } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
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
  res.json(cart);
});

// Update quantity of a listing in the cart
export const updateCartItem = catchAsync(async (req, res, next) => {
  const { listingId, quantity } = req.body;

  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.listing.toString() === listingId
  );
  if (itemIndex === -1) {
    return next(new AppError("Listing not in cart", 404));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.json(cart);
});

// Remove a listing from the cart
export const removeFromCart = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.listing.toString() !== listingId
  );
  await cart.save();

  res.json(cart);
});

// Clear the cart
export const clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = [];
  await cart.save();

  res.json(cart);
});

import catchAsync from "../utils/catchAsync.js";
import * as cartService from "../services/cartService.js";

// ✅ Get current user's cart
export const getCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCartService(req.session.user._id);
  res.json(cart);
});

// ✅ Add listing to cart
export const addToCart = catchAsync(async (req, res, next) => {
  const { listingId, quantity } = req.body;
  const cart = await cartService.addToCartService(
    req.session.user._id,
    listingId,
    quantity
  );
  res.json(cart);
});

// ✅ Update listing quantity
export const updateCartItem = catchAsync(async (req, res, next) => {
  const { listingId, quantity } = req.body;
  const cart = await cartService.updateCartItemService(
    req.session.user._id,
    listingId,
    quantity
  );
  res.json(cart);
});

// ✅ Remove listing from cart
export const removeFromCart = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;
  const cart = await cartService.removeFromCartService(
    req.session.user._id,
    listingId
  );
  res.json(cart);
});

// ✅ Clear the cart
export const clearCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.clearCartService(req.session.user._id);
  res.json(cart);
});

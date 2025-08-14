import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

// Create an order from cart or directly from products
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body; // optional: [{ product: listingId, quantity }]

    let orderProducts = [];

    if (products && products.length > 0) {
      // Use products from request body
      orderProducts = products;
    } else {
      // Use products from user's cart
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart || cart.items.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      orderProducts = cart.items.map((item) => ({
        product: item.listing,
        quantity: item.quantity,
      }));

      // Clear cart after creating order
      cart.items = [];
      await cart.save();
    }

    const order = new Order({ products: orderProducts });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin or user)
export const getOrders = async (req, res) => {
  try {
    // If you want to filter by user: { user: req.user._id }
    const orders = await Order.find().populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

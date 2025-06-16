const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🆕 Create new order and clear cart
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // Create the order
    const newOrder = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // Clear the cart after successful order
    await Cart.findOneAndDelete({ user: req.user._id });

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Order creation failed" });
  }
});

// Fetch all orders of logged-in user
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

//  What this does:

// Saves the order
// Clears the cart for that user (await Cart.findOneAndDelete(...))
// Returns the order to frontend

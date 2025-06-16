const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

// @ route GET /api/admin/orders
// @ desc Get all orders
// @ access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");

    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// @ route GET /api/admin/orders/:id
// @ desc Get order by ID & status update
// @ access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
  const incomingStatus = req.body.status?.toLowerCase();

  order.status = incomingStatus || order.status;
  order.isDelivered = incomingStatus === "delivered" ? true : order.isDelivered;
  order.deliveredAt = incomingStatus === "delivered" ? Date.now() : order.deliveredAt;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
} else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @ route DELETE /api/admin/orders/:id
// @ desc Delete order by ID
// @ access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: "Order Remove" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;

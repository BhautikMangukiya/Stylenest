const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET /api/admin/overview
// @desc    Get admin dashboard statistics
// @access  Private/Admin 
router.get("/overview", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overview data" });
  }
});

// @route   GET /api/admin/recent-orders
// @desc    Get recent orders for dashboard
// @access  Private/Admin
router.get("/recent-orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
});

module.exports = router;

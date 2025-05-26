const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const User = require("../models/User");

const router = express.Router();

// @ route GET /api/admin/products
// @ desc Get all products [admin only]
// @ access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products) {
      res.status(404).json({ message: "Product not Found" });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



module.exports = router;

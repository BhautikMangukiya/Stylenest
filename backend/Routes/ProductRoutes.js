const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper: case-insensitive regex
const createRegex = (value) => new RegExp(`^${value}$`, "i");

// @route POST /api/products
// @desc Create new product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/products/:id
// @desc Update product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete product
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.remove();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products
// @desc Get all products with filters and search
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection, sizes, color, gender,
      minPrice, maxPrice, sort: sortBy, search,
      category, material, brand, limit
    } = req.query;

    const query = {};

    // Basic filters
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = createRegex(collection);
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = createRegex(category);
    }

    if (material) {
      query.material = { $in: material.split(",").map((m) => createRegex(m.trim())) };
    }

    if (brand) {
      query.brand = { $in: brand.split(",").map((b) => createRegex(b.trim())) };
    }

    if (sizes) {
      query.sizes = { $in: sizes.split(",").map((s) => createRegex(s.trim())) };
    }

    if (color) {
      query.colors = createRegex(color);
    }

    if (gender) {
      query.gender = createRegex(gender);
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Smart keyword-based search
    if (search) {
      const tokens = search.toLowerCase().split(" ");
      query.$or = tokens.flatMap((token) => [
        { name: { $regex: token, $options: "i" } },
        { description: { $regex: token, $options: "i" } },
        { gender: { $regex: token, $options: "i" } },
        { category: { $regex: token, $options: "i" } },
        { colors: { $regex: token, $options: "i" } },
        { material: { $regex: token, $options: "i" } },
        { brand: { $regex: token, $options: "i" } },
      ]);
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: recommended
    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case "priceasc":
          sort = { price: 1 };
          break;
        case "pricedesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          sort = { createdAt: -1 }; // recommended
      }
    }

    let productsQuery = Product.find(query).sort(sort);
    if (limit) productsQuery = productsQuery.limit(Number(limit));

    const products = await productsQuery.exec();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/best-seller
// @desc Get best-selling products
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ rating: -1 }).limit(5);
    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/new-arrivals
// @desc Get new arrivals
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/:id
// @desc Get product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

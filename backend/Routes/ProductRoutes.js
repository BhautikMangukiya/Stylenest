const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to create case-insensitive regex
const createRegex = (value) => new RegExp(`^${value}$`, 'i');

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/products/:id
// @desc Update an existing product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not Found" });

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.remove();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products
// @desc Get all products with filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const query = {};
    const { 
      collection, sizes, color, gender, 
      minPrice, maxPrice, sortBy, search,
      category, material, brand, limit 
    } = req.query;

    // Collection filter
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = createRegex(collection);
    }

    // Category filter
    if (category && category.toLowerCase() !== "all") {
      query.category = createRegex(category);
    }

    // Material filter (array)
    if (material) {
      query.material = { 
        $in: material.split(',').map(m => createRegex(m.trim()))
      };
    }

    // Brand filter (array)
    if (brand) {
      query.brand = { 
        $in: brand.split(',').map(b => createRegex(b.trim()))
      };
    }

    // Sizes filter (array)
    if (sizes) {
      query.sizes = { 
        $in: sizes.split(',').map(s => createRegex(s.trim()))
      };
    }

    // Color filter
    if (color) {
      query.colors = createRegex(color);
    }

    // Gender filter
    if (gender) {
      query.gender = createRegex(gender);
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case 'priceasc':
          sort = { price: 1 };
          break;
        case 'pricedesc':
          sort = { price: -1 };
          break;
        case 'popularity':
          sort = { rating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    // Execute query
    let productsQuery = Product.find(query).sort(sort);
    if (limit) productsQuery = productsQuery.limit(Number(limit));
    
    const products = await productsQuery.exec();
    res.json(products);
  } catch (error) {
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
    res.status(500).send("Server Error");
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
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/:id
// @desc Get product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product Not Found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
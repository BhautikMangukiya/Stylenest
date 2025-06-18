const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const createRegex = (value) => new RegExp(`^${value}$`, "i");

router.post("/", protect, admin, async (req, res) => {
  try {
    const productData = req.body;
    const { sku, images } = productData;

    const existing = await Product.findOne({ sku: sku?.trim() });
    if (existing) {
      return res.status(409).json({
        message: "A product with the same SKU already exists.",
        productId: existing._id,
      });
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({ message: "Images must be an array" });
    }
    if (images) {
      for (const img of images) {
        if (!img.url || img.url.startsWith("blob:")) {
          return res.status(400).json({ message: "Invalid image URL" });
        }
      }
    }

    const product = new Product({ ...productData, user: req.user._id });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productData = req.body;
    const { images } = productData;

    if (images && !Array.isArray(images)) {
      return res.status(400).json({ message: "Images must be an array" });
    }
    if (images) {
      for (const img of images) {
        if (!img.url || img.url.startsWith("blob:")) {
          return res.status(400).json({ message: "Invalid image URL" });
        }
      }
    }

    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) product[key] = value;
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      sizes,
      color,
      gender,
      minPrice,
      maxPrice,
      sort: sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    const query = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = createRegex(collection);
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = createRegex(category);
    }

    if (material) {
      query.material = {
        $in: material.split(",").map((m) => createRegex(m.trim())),
      };
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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

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

    let sort = { createdAt: -1 };
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
      }
    }

    let productsQuery = Product.find(query).sort(sort);
    if (limit) productsQuery = productsQuery.limit(Number(limit));

    const products = await productsQuery.exec();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ rating: -1 }).limit(5);
    res.json(bestSellers);
  } catch (error) {
    console.error("Get best-sellers error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(newArrivals);
  } catch (error) {
    console.error("Get new-arrivals error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;

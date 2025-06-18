const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const getCart = async (userId, guestId) => {
  const query = userId ? { user: userId } : { guestId };
  const cart = await Cart.findOne(query).populate("products.productId");
  if (cart) {
    cart.products = cart.products.filter((p) => p.productId);
    cart.totalPrice = cart.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    await cart.save();
  }
  return cart;
};

const validateCartItem = (productId, quantity, size, color) => {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("Invalid product ID");
  if (typeof quantity !== "number" || quantity <= 0)
    throw new Error("Invalid quantity");
  if (size && typeof size !== "string") throw new Error("Invalid size");
  if (color && typeof color !== "string") throw new Error("Invalid color");
};

router.get("/", async (req, res) => {
  try {
    const cart = await getCart(req.query.userId, req.query.guestId);
    return res.status(200).json(cart || { products: [], totalPrice: 0 });
  } catch (err) {
    console.error("GET /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, userId, guestId } = req.body;
  try {
    validateCartItem(productId, quantity, size, color);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart =
      (await getCart(userId, guestId)) ||
      new Cart({
        user: userId || null,
        guestId: userId ? null : guestId || `guest_${Date.now()}`,
        products: [],
        totalPrice: 0,
      });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.equals(productId) &&
        (p.size || "").toLowerCase() === (size || "").toLowerCase() &&
        (p.color || "").toLowerCase() === (color || "").toLowerCase()
    );

    if (index >= 0) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: product.price,
        quantity,
        size,
        color,
      });
    }

    cart.totalPrice = cart.products.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("POST /cart error:", err);
    res.status(400).json({ message: err.message || "Error adding to cart" });
  }
});

router.put("/", async (req, res) => {
  const { productId, size, color, quantity, userId, guestId } = req.body;
  try {
    validateCartItem(productId, quantity, size, color);
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.equals(productId) &&
        (p.size || "").toLowerCase() === (size || "").toLowerCase() &&
        (p.color || "").toLowerCase() === (color || "").toLowerCase()
    );

    if (index === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      cart.products.splice(index, 1);
    } else {
      cart.products[index].quantity = quantity;
    }

    cart.totalPrice = cart.products.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("PUT /cart error:", err);
    res.status(400).json({ message: err.message || "Error updating cart" });
  }
});

router.delete("/item", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.equals(productId) &&
          (p.size || "").toLowerCase() === (size || "").toLowerCase() &&
          (p.color || "").toLowerCase() === (color || "").toLowerCase()
        )
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.totalPrice = cart.products.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("DELETE /item error:", err);
    res.status(500).json({ message: "Error removing item" });
  }
});

module.exports = router;

const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper: Get cart for user or guest
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// Create or Update Cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    const item = {
      productId,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      quantity,
      size,
      color,
    };

    if (!cart) {
      const newCart = await Cart.create({
        user: userId || null,
        guestId: guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        products: [item],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push(item);
    }

    cart.totalPrice = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart POST error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update Cart Item
router.put("/", async (req, res) => {
  const { productId, size, color, quantity, userId, guestId } = req.body;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index === -1) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      cart.products.splice(index, 1);
    } else {
      cart.products[index].quantity = quantity;
    }

    cart.totalPrice = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart PUT error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete Cart Item
router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        )
    );

    cart.totalPrice = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get Cart
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart GET error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Merge guest cart into user cart
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user._id;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    if (!guestCart) {
      return userCart
        ? res.status(200).json(userCart)
        : res.status(404).json({ message: "No guest cart found" });
    }

    if (guestCart.products.length === 0) {
      await Cart.findOneAndDelete({ guestId });
      return res.status(400).json({ message: "Guest cart was empty" });
    }

    if (userCart) {
      guestCart.products.forEach((guestItem) => {
        const existingIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (existingIndex >= 0) {
          userCart.products[existingIndex].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await userCart.save();
      await Cart.findOneAndDelete({ guestId });

      return res.status(200).json(userCart);
    }

    // No user cart, convert guest cart to user cart
    guestCart.user = userId;
    guestCart.guestId = undefined;
    await guestCart.save();

    return res.status(200).json(guestCart);
  } catch (error) {
    console.error("Cart MERGE error:", error);
    return res.status(500).json({ message: "Failed to merge cart" });
  }
});

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    const item = {
      productId: product._id,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      quantity,
      size,
      color,
    };

    if (!cart) {
      const newCart = await Cart.create({
        user: userId || null,
        guestId: guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        products: [item],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === product._id.toString() &&
        p.size === size &&
        p.color === color
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push(item);
    }

    cart.totalPrice = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart POST error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


// 12.20 
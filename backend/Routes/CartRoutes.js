const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================
// 🔧 Helpers
// ==========================
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

const calculateTotal = (products) =>
  products.reduce((total, item) => total + item.price * item.quantity, 0);

// ==========================
// 🛒 Add Product to Cart
// POST /api/cart
// ==========================
router.post("/", protect, async (req, res) => {
  const { productID, quantity, size, color, guestId } = req.body;
  const userId = req.user?.id;

  try {
    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    const newItem = {
      productId: productID,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      size,
      color,
      quantity,
    };

    if (cart) {
      const index = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productID &&
          item.size === size &&
          item.color === color
      );

      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push(newItem);
      }

      cart.totalPrice = calculateTotal(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    }

    const newCart = await Cart.create({
      userId: userId || undefined,
      guestId: guestId || `guest_${Date.now()}`,
      products: [newItem],
      totalPrice: product.price * quantity,
    });

    res.status(201).json(newCart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 🔁 Update Quantity
// PUT /api/cart
// ==========================
router.put("/", protect, async (req, res) => {
  const { productID, quantity, size, color, guestId } = req.body;
  const userId = req.user?.id;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productID &&
        item.size === size &&
        item.color === color
    );

    if (index > -1) {
      if (quantity > 0) {
        cart.products[index].quantity = quantity;
      } else {
        cart.products.splice(index, 1);
      }

      cart.totalPrice = calculateTotal(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    }

    res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// ❌ Remove Product
// DELETE /api/cart
// ==========================
router.delete("/", protect, async (req, res) => {
  const { productID, size, color, guestId } = req.body;
  const userId = req.user?.id;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (item) =>
        !(
          item.productId.toString() === productID &&
          item.size === size &&
          item.color === color
        )
    );

    cart.totalPrice = calculateTotal(cart.products);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 📦 Get Cart
// GET /api/cart
// ==========================
router.get("/", protect, async (req, res) => {
  const guestId = req.query.guestId;
  const userId = req.user?.id;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 🧹 Clear Cart
// DELETE /api/cart/clear
// ==========================
router.delete("/clear", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user?.id;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 🔄 Merge Guest Cart
// POST /api/cart/merge
// ==========================
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user?.id;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ userId });

    if (!guestCart) {
      return res.status(200).json({ message: "No guest cart to merge" });
    }

    if (userCart) {
      guestCart.products.forEach((guestItem) => {
        const index = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (index > -1) {
          userCart.products[index].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = calculateTotal(userCart.products);
      await userCart.save();
      await guestCart.deleteOne();

      return res.status(200).json({ message: "Cart merged", cart: userCart });
    } else {
      guestCart.userId = userId;
      guestCart.guestId = undefined;
      await guestCart.save();

      return res.status(200).json({ message: "Cart transferred", cart: guestCart });
    }
  } catch (err) {
    console.error("Merge cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

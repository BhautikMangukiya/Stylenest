const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// helper function to get a cart by user Id or guest id
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }

  return null;
};

// @ route POST /api/cart
// @ desc add a product to the cart for a guest or logged in user
// @ access Public

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the cart based on userId or guestId
    let cart = await getCart(userId, guestId);

    if (cart) {
      // Check if product with same ID, size, and color already exists
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // Update quantity if product exists
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product entry
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          quantity,
          size,
          color,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      await cart.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart,
      });
    } else {
      // Create a new cart
      const generatedGuestId =
        guestId ||
        "stylenest_guest_" +
          Date.now() +
          "_" +
          Math.random().toString(36).substring(2, 10);

      const newCart = await Cart.create({
        user: userId || null,
        guestId: generatedGuestId,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            quantity,
            size,
            color,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json({
        message: "New cart created successfully",
        cart: newCart,
      });
    }
  } catch (error) {
    console.error("Cart error:", error.message);
    return res.status(500).json({
      message: "An error occurred while adding to the cart",
      error: error.message,
    });
  }
});

// @ route PUT /api/cart
// @ desc update a product in the cart
// @ access Public

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    // Retrieve cart using userId or guestId
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart by productId, size, and color
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity > 0) {
      // Update quantity
      cart.products[productIndex].quantity = quantity;
    } else {
      // Remove product if quantity is 0 or less
      cart.products.splice(productIndex, 1);
    }

    // Recalculate total cart price
    cart.totalPrice = cart.products.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Cart update error:", error.message);
    return res.status(500).json({
      message: "An error occurred while updating the cart",
      error: error.message,
    });
  }
});

// @ route DELETE /api/cart
// @ desc delete a product from the cart
// @ access Public

router.delete("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart by productId, size, and color
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);

    // Recalculate total cart price
    cart.totalPrice = cart.products.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the product from the cart",
      error: error.message,
    });
  }
});

// @ route GET /api/cart
// @ desc get the cart for a user or guest
// @ access Public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    let cart = await getCart(userId, guestId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @ route POST /api/cart/merge
// @ desc Merge guest cart into user cart on login
// @ access Public



router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    console.log("User ID in merge:", userId);

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    if (!guestCart) {
      if (userCart) return res.status(200).json(userCart);
      return res.status(404).json({ message: "Guest cart not found" });
    }

    if (guestCart.products.length === 0) {
      return res.status(400).json({ message: "Guest cart is empty" });
    }

    if (userCart) {
      guestCart.products.forEach((guestItem) => {
        const productIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (productIndex > -1) {
          userCart.products[productIndex].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = userCart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await userCart.save();
      await Cart.findOneAndDelete({ guestId });

      return res.status(200).json(userCart);
    } else {
      // No existing user cart, assign guest cart to user
      guestCart.user = userId;
      guestCart.guestId = undefined;
      guestCart.totalPrice = guestCart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await guestCart.save();

      return res.status(200).json(guestCart);
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while merging carts" });
  }
});

module.exports = router;

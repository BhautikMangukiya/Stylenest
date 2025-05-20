const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { Protect } = require("../middleware/authMiddleware");

const router = express.Router();

// helper function to get a cart by user id or guest id

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};


// @ route POST /api/cart
// @ desc add a product to the cart for a guest or logged in user
// @ access Public

router.post("/", async (req, res) => {
  const { productID, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productID);

    if (!product) return res.status(404).json({ message: "Product Not Found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productID &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId: productID,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        userId: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId: productID,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

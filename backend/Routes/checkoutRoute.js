const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// @ route POST /api/checkout
// @ desc Create a new checkout session
// @ access Private
 
router.post("/", protect, async (req, res) => {
  const { checkOutItems, ShippingAddress, paymentMethod, totalPrice, quantity, size, color } = req.body;

  // Basic validation
  if (!Array.isArray(checkOutItems) || checkOutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  if (!ShippingAddress || !paymentMethod || totalPrice == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkOutItems: checkOutItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      ShippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
    });

    return res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//  @desc    Update checkout to mark as paid
//  @route   PUT /api/checkout/:id/pay
//  @access  Private

router.put("/:id/pay", protect, async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, paymentDetails } = req.body;

  if (paymentStatus !== "paid") {
    return res.status(400).json({ message: "Invalid or missing payment status" });
  }

  try {
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails || {};
    checkout.paidAt = new Date();

    await checkout.save();

    return res.status(200).json(checkout);
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//  @route   POST /api/checkout/:id/finalize
//  @desc    Finalize checkout and convert to order
//  @access  Private
 
router.post("/:id/finalize", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    // Validate shipping address
    const { ShippingAddress } = checkout;
    const requiredFields = ["address", "city", "postalCode", "country"];
    const missingFields = requiredFields.filter(field => !ShippingAddress?.[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required shipping address fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate order items
    if (!Array.isArray(checkout.checkOutItems) || checkout.checkOutItems.length === 0) {
      return res.status(400).json({ message: "Checkout has no items" });
    }

    const invalidItems = checkout.checkOutItems.some(item => !item.productId);
    if (invalidItems) {
      return res.status(400).json({ message: "Each item must have a productId" });
    }

    // Create order
    let finalOrder;
    try {
      finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkOutItems.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: ShippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });
    } catch (error) {
      console.error("Error creating order:", error.message);
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Finalize checkout
    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    // Clear cart
    await Cart.findOneAndDelete({ user: checkout.user });

    return res.status(201).json({
      message: "Order created and checkout finalized successfully",
      order: finalOrder,
    });
  } catch (error) {
    console.error("Error finalizing checkout:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

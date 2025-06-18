const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      role: user.role,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" });
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found with this email." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
});

// @route   GET /api/users/profile
// @desc    Get Logged-in user's profile (protected route)
// @access  Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;

// middleware/protect.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data (without password) to req object
      req.user = await User.findById(decoded.user.id).select("-password");

      next(); // proceed to the route
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token was found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// middleware to chek if the user is and admin 

const admin = (req, res, next) => {
  if (req.user && req.user.role == "admin"){
    next()
  }else {
    res.status(403).json({message: "Not authorized as an admin"})
  }
}

module.exports = {protect, admin};

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const createDefaultAdmin = require("./utils/createDefaultAdmin");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

createDefaultAdmin();

// Port
const PORT = process.env.PORT || 9000;

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to the StyleNest API");
});

// ================== ROUTES ================== //

// User-Facing APIs
app.use("/api/users", require("./Routes/UserRoutes"));
app.use("/api/products", require("./Routes/ProductRoutes"));
app.use("/api/cart", require("./Routes/CartRoutes"));
app.use("/api/checkout", require("./Routes/checkoutRoute"));
app.use("/api/orders", require("./Routes/orderRoutes"));
app.use("/api/upload", require("./Routes/uploadRoute"));
app.use("/api", require("./Routes/subscribeRoute")); // Consider using /api/subscribe

// Admin APIs
app.use("/api/admin/users", require("./Routes/AdminRoutes"));
app.use("/api/admin/products", require("./Routes/AdminProduct"));
app.use("/api/admin/orders", require("./Routes/AdminOrderRoute"));
app.use("/api/admin/dashboard", require("./Routes/AdminHomePageRoute")); // Admin Dashboard

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n✅ StyleNest API is running at: http://localhost:${PORT}`);
});

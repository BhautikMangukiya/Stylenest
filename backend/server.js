const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./Routes/UserRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const checkOutRoutes = require("./Routes/checkoutRoute");
const orderRoutes = require("./Routes/orderRoutes");
const uploadRoute = require("./Routes/uploadRoute")
const subscribeRoute = require("./Routes/subscribeRoute")
const AdminRoute = require("./Routes/AdminRoutes")
const AdminProduct = require("./Routes/AdminProduct");
const AdminOrderRoute = require("./Routes/AdminOrderRoute");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Stylnest API");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkOutRoutes);
app.use("/api/orders", orderRoutes);
//  app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api", subscribeRoute);

// Admin Routes
app.use("/api/admin/users", AdminRoute);
app.use("/api/admin/products", AdminProduct);
app.use("/api/admin/orders", AdminOrderRoute);

app.listen(PORT, () => {
  console.log(`\n🚀 StyleNest Server is live at http://localhost:${PORT}`);
});

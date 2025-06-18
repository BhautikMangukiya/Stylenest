const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const createDefaultAdmin = require("./utils/createDefaultAdmin");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();
createDefaultAdmin();

const userRoutes = require("./Routes/UserRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const checkoutRoutes = require("./Routes/checkoutRoute");
const orderRoutes = require("./Routes/orderRoutes");
const uploadRoutes = require("./Routes/uploadRoute");
const subscribeRoutes = require("./Routes/subscribeRoute");
const orderDetailsRoutes = require("./Routes/OrderDetailsRoute");

const adminUserRoutes = require("./Routes/AdminRoutes");
const adminProductRoutes = require("./Routes/AdminProduct");
const adminOrderRoutes = require("./Routes/AdminOrderRoute");
const adminDashboardRoutes = require("./Routes/AdminHomePageRoute");

app.get("/", (req, res) => {
  res.send("🚀 Welcome to the StyleNest API");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/orderdetails", orderDetailsRoutes);

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`\n✅ StyleNest API is running at: http://localhost:${PORT}`);
});

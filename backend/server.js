const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const connectDB = require('./config/db')

const userRoutes = require("./Routes/UserRoutes")
const productRoutes = require("./Routes/ProductRoutes")
const cartRoutes = require("./Routes/CartRoutes")
 

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config()

const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Stylnes API");
});

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes )

app.listen(PORT, () => {
  console.log(`\n🚀 Stylnes Server is live at http://localhost:${PORT}`);
});

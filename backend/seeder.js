const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");
const Cart = require("./models/Cart")

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully."))
.catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing collections
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Assign user ID to each product
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error.message);
    process.exit(1);
  }
};

seedData();

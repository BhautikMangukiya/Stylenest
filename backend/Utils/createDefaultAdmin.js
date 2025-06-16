const User = require("../models/User");

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const defaultAdmin = new User({
        name: "Admin",
        email: `${process.env.DEFAULT_ADMIN_EMAIL}`,
        password: `${process.env.DEFAULT_ADMIN_PASSWORD}`,
        role: "admin",
      });

      await defaultAdmin.save();
    }
  } catch (error) {
    console.error("Failed to create default admin user:", error);
  }
};

module.exports = createDefaultAdmin;

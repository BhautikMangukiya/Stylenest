const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { MdEmail } = require("react-icons/md");

// @ route POST /api/Subscriber
// @ desc handle subscription
// @ access Public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required" });
  }

  try {
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
});

module.exports = router;

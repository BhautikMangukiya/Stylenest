const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "uploads",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await streamUpload(file.buffer);
          return {
            url: result.secure_url,
            public_id: result.public_id,
            altText: file.originalname,
          };
        } catch (err) {
          console.error(`Failed to upload image: ${file.originalname}`, err);
          return null;
        }
      })
    );

    const successfulUploads = uploadResults.filter(Boolean);

    if (successfulUploads.length === 0) {
      return res.status(500).json({ message: "All image uploads failed" });
    }

    res.status(200).json({
      message: "Images uploaded successfully",
      images: successfulUploads,
    });
  } catch (err) {
    console.error("Unexpected upload error:", err);
    res.status(500).json({
      message: "Image upload failed",
      error: err.message || "Unknown error",
    });
  }
});

module.exports = router;

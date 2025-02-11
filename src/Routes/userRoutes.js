require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream"); // Import stream module
const fileType = require("file-type");
const {
  verifyAccessToken,
} = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  getUser,
  getUserStatus,
  updateUserStatus,
} = require("../Controllers/UserControllers/UserController");
const { User } = require("../Models/User/User");

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dqhh3g0s8",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Fetch user information
router.get("/:userId", getUser);

// Fetch user status
router.get("/:userId/status", getUserStatus);

// Update user status
router.post("/:userId/status", updateUserStatus);

// Update user profile picture
router.post("/:userId/profilpic", upload.single("image"), async (req, res) => {
  const { userId } = req.params;
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded");
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "profile_pictures",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).send("Error uploading image");
        }

        // Save img url to database 
        const user = await User.findById(userId);
        user.profilePic = result.secure_url;
        await user.save();

        // Send the image URL in response
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    // Create stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading image");
  }
});

module.exports = router;

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
  updateUserInfo,
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

// Update user info
router.post("/:userId/edit", updateUserInfo);

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

    // Look up user to check profile picture
    const user = await User.findById(userId);

    // Check if user already has a profile pic uploaded
    if (user.profilePic !== null) {
      const url = user.profilePic;
      const publicIdEnd = url.split("/").pop().split(".")[0];
      const profilePicArr = url.split("/");
      const publicIdStart = profilePicArr[profilePicArr.length - 2];

      // This is the full publicId of the image
      const publicId = publicIdStart + "/" + publicIdEnd;

      try {
        // Delete profile picture from cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting old profile picture:", error);
      }
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

router.delete("/:userId/profilpic", async (req, res) => {
  const { userId } = req.params;
  try {
    // Look up user
    const user = await User.findById(userId);

    if (user.profilePic !== null) {
      const url = user.profilePic;
      const publicIdEnd = url.split("/").pop().split(".")[0];
      const profilePicArr = url.split("/");
      const publicIdStart = profilePicArr[profilePicArr.length - 2];

      // This is the full publicId of the image
      const publicId = publicIdStart + "/" + publicIdEnd;

      try {
        // Delete profile picture from cloudinary
        await cloudinary.uploader.destroy(publicId);
        user.profilePic = null;
        console.log(user);
        res.status(200).json(user);
      } catch (error) {
        console.log("Error deleting profile picture:", error);
      }
    } else {
      res.status(404).json({ message: "No profile picture found" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

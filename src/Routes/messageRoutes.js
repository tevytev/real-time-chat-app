const express = require("express");
const {
  verifyAccessToken,
} = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  getMessages,
  createMessage,
  getLivingRoomMessages,
  createLivingRoomMessage,
  markMessagesAsRead,
  createImageMessage,
} = require("../Controllers/MessageControllers/MessageController");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream"); // Import stream module
const fileType = require("file-type");
const { Room } = require("../Models/Room/Room");
const { LivingRoom } = require("../Models/LivingRoom/LivingRoom");
const { Message } = require("../Models/Message/Message");

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

// Retreive messages
router.get("/:roomId", getMessages);

// Retreive living room messages
router.get("/livingRoom/:livingRoomId", getLivingRoomMessages);

// Create rooms message
router.post("/create/:roomId", createMessage);

// Create living room message
router.post("/livingRoom/create/:livingRoomId", createLivingRoomMessage);

// Create living room image message
router.post("/livingRoom/createImage/:livingRoomId", upload.single("image"),
async (req, res) => {
  const { id } = req.user;
  const { livingRoomId } = req.params;
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded");
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "message_pictures",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).send("Error uploading image");
        }

        // Store image url in variable
        const imageUrl = result.secure_url;

        try {
          // Look up and verify particular room that the user message is being sent to
          const livingRoom = await LivingRoom.findById(livingRoomId).exec();

          // if room not found send error
          if (!livingRoom) {
            res.status(404).send({ message: "Failed to save message" });
          }

          // Create and save new message to database
          const newMessage = await Message({
            image: imageUrl,
            user: id,
            livingRoom: livingRoomId,
          });

          const savedMessage = await newMessage.save();
          // Update user room last updated at
          livingRoom.updatedAt = Date.now();
          // Save room document in database
          await livingRoom.save();

          // Message save success
          if (savedMessage) {
            res.status(201).json({ message: newMessage });
          }
        } catch (error) {
          console.error("Error during message:", error);
          res.status(500).json({ message: "Failed to save message" });
        }
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
})

// Create rooms message
router.post(
  "/createImage/:roomId",
  upload.single("image"),
  async (req, res) => {
    const { id } = req.user;
    const { roomId } = req.params;
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded");
      }

      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "message_pictures",
        },
        async (error, result) => {
          if (error) {
            return res.status(500).send("Error uploading image");
          }

          // Store image url in variable
          const imageUrl = result.secure_url;

          try {
            // Look up and verify particular room that the user message is being sent to
            const room = await Room.findById(roomId).exec();

            // if room not found send error
            if (!room) {
              res.status(404).send({ message: "Failed to save message" });
            }

            // Create and save new message to database
            const newMessage = await Message({
              image: imageUrl,
              user: id,
              room: roomId,
            });

            // Add user to readBy schmea array
            newMessage.readBy.push(id);

            const savedMessage = await newMessage.save();
            // Update user romm last updated at
            room.updatedAt = Date.now();
            // Save room document in database
            await room.save();

            // Message save success
            if (savedMessage) {
              res.status(201).json({ message: newMessage });
            }
          } catch (error) {
            console.error("Error during message:", error);
            res.status(500).json({ message: "Failed to save message" });
          }
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
  }
);

// Mark messages as read
router.post("/read/:roomId", markMessagesAsRead);

module.exports = router;

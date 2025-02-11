const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  getMessages,
  createMessage,
  getLivingRoomMessages,
  createLivingRoomMessage,
  markMessagesAsRead
} = require("../Controllers/MessageControllers/MessageController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Retreive messages
router.get("/:roomId", getMessages);

// Retreive living room messages
router.get("/livingRoom/:livingRoomId", getLivingRoomMessages);

// Create living room message
router.post("/livingRoom/create/:livingRoomId", createLivingRoomMessage);

// Create message
router.post("/create/:roomId", createMessage);

// Mark messages as read
router.post("/read/:roomId", markMessagesAsRead);

module.exports = router;

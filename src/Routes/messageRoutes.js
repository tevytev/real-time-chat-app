const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  getMessages,
  createMessage,
} = require("../Controllers/MessageControllers/MessageController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Retreive messages
router.get("/:roomId", getMessages);

// Create message
router.post("/:roodId", createMessage);

module.exports = router;

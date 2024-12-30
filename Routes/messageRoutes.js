const express = require("express");
const { verifyJWT } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  getMessages,
  createMessage,
} = require("../Controllers/MessageControllers/MessageController");

const router = express.Router();

router.get("/:roomId", verifyJWT, getMessages);
router.post("/", verifyJWT, createMessage);

module.exports = router;

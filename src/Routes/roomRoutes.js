const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const { createRoom } = require("../Controllers/RoomControllers/RoomController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

router.post("/", createRoom);


module.exports = router;
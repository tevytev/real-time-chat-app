const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const { createRoom, getAllRooms, getActiveRoom } = require("../Controllers/RoomControllers/RoomController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

router.post("/", createRoom);
router.get("/all", getAllRooms);
router.get("/:roomId", getActiveRoom);


module.exports = router;
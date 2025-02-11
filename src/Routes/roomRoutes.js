const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const { createRoom, getAllRooms, getActiveRoomUsers, getLivingRommActiveUsers } = require("../Controllers/RoomControllers/RoomController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

router.post("/", createRoom);
router.get("/all", getAllRooms);
router.get("/:roomId", getActiveRoomUsers);
router.get("/livingRoom/:livingRoomId", getLivingRommActiveUsers);


module.exports = router;
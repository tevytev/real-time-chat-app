const express = require("express");
const { verifyJWT } = require("../Middleware/AuthMiddleware/authMiddleware");
const { createRoom } = require("../Controllers/RoomControllers/RoomController");

const router = express.Router();

router.post("/", verifyJWT, createRoom);


module.exports = router;
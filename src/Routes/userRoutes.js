const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const { getUser } = require("../Controllers/UserControllers/UserController");


const router = express.Router();

router.get("/:userId", getUser);

module.exports = router;
const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  createFamily,
  joinFamily,
  leaveFamily
} = require("../Controllers/FamilyControllers/FamilyController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Create family route
router.post("/", createFamily);

// Join family route
router.post("/join", joinFamily);

// Leave family route
router.post("/leave", leaveFamily);

module.exports = router;

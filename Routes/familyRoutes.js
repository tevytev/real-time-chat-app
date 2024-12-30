const express = require("express");
const { verifyJWT } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  createFamily,
  joinFamily,
  leaveFamily
} = require("../Controllers/FamilyControllers/FamilyController");

const router = express.Router();

// Create family route
router.post("/", verifyJWT, createFamily);

// Join family route
router.post("/join", verifyJWT, joinFamily);

// Leave family route
router.post("/leave", verifyJWT, leaveFamily);

module.exports = router;

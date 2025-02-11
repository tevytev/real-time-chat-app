const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
  getfamilyStatus
} = require("../Controllers/FamilyControllers/FamilyController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Create family route
router.post("/", createFamily);

// Fetch family route
router.get("/:familyId", getFamily);

// Join family route
router.post("/join", joinFamily);

// Leave family route
router.delete("/leave", leaveFamily);

// Fetch family status
router.get("/:familyId/status", getfamilyStatus);

module.exports = router;

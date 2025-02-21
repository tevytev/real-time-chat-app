const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
  getfamilyStatus,
  getFamilyMembers
} = require("../Controllers/FamilyControllers/FamilyController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Create family route
router.post("/", createFamily);

// Fetch family route
router.get("/:familyId", getFamily);

router.get("/:familyId/members", getFamilyMembers);

// Edit family route
router.post("/:familyId/edit", )

// Join family route
router.post("/join", joinFamily);

// Leave family route
router.post("/leave", leaveFamily);

// Fetch family status
router.get("/:familyId/status", getfamilyStatus);

module.exports = router;

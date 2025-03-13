const express = require("express");
const { verifyAccessToken } = require("../Middleware/AuthMiddleware/authMiddleware");
const {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
  getfamilyStatus,
  getFamilyMembers,
  removeFamilyMember,
  editFamily,
  changeCreator
} = require("../Controllers/FamilyControllers/FamilyController");

const router = express.Router();

// User authentication middleware
router.use(verifyAccessToken);

// Create family route
router.post("/", createFamily);

// Fetch family route
router.get("/:familyId", getFamily);

// Fetch family members
router.get("/:familyId/members", getFamilyMembers);

// Edit family route
router.post("/:familyId/edit", editFamily);

// Join family route
router.post("/join", joinFamily);

// Leave family route
router.post("/leave", leaveFamily);

// Remove family member from family
router.post("/remove", removeFamilyMember);

// Fetch family status
router.get("/:familyId/status", getfamilyStatus);

// Change family creator
router.post("/:familyId/creator", changeCreator);

module.exports = router;

const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
  changePassword
} = require("../Controllers/AuthControllers/AuthController");

const router = express.Router();

// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Logout a user
router.post("/logout", logoutUser);

// Refresh a user's access token
router.post("/refresh", refresh);

// Chnage user password
router.post("/:userId/password", changePassword);

module.exports = router;
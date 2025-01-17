const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refresh
} = require("../Controllers/AuthControllers/AuthController");

const router = express.Router();

// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Logout a user
router.post("/logout", logoutUser);

// Refresh a user's access token
router.post("/refresh", refresh)

module.exports = router;
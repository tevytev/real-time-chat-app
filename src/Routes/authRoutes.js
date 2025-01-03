const express = require("express");
const {
  registerUser,
  loginUser,
  refresh
} = require("../Controllers/AuthControllers/AuthController");

const router = express.Router();

// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Refresh a user's access token
router.post("/refresh", refresh)

module.exports = router;
const { User } = require("../../Models/User/User");
const {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
} = require("./AccessTokenControllers/generateAccessToken");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create user
    const newUser = await User({ username, email, password });

    // Save user to database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let accessToken = null;
  let refreshToken = null;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, username: user.username };
    // Create JWT token if the passwords match
    accessToken = generateAccessToken(payload);

    if (accessToken !== null) {
      refreshToken = generateRefreshToken(payload);
      if (refreshToken !== null) storeRefreshToken(user._id, refreshToken);
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

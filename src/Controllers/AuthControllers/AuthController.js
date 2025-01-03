const { User } = require("../../Models/User/User");
const { RefreshToken } = require("../../Models/RefreshToken/RefreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt/jwt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if user already exists already
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

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

    // Create JWT token and refresh token if the passwords match
    const payload = { id: user._id, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    await storeRefreshToken(user._id, refreshToken);

    // Set and send new refresh token cookie and access token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie is not accessible via Javascript
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days until exp
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const refresh = async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;

  try {
    // Verify if refresh token is in user's cookies
    if (!refreshTokenFromCookie) {
      res.status(403).json({ message: "Refresh token is missing" });
    }

    // Verify the refresh token using jsonwebtoken library
    const decodedRefreshToken = verifyRefreshToken(refreshTokenFromCookie);
    if (!decodedRefreshToken)
      return res.status(403).json({ message: "invalid or expired token" });

    // Look up refresh token in database
    const storedRefreshToken = await RefreshToken.findOne({
      token: refreshTokenFromCookie,
    });
    if (!storedRefreshToken)
      return res.status(403).json({ message: "invalid refresh token" });

    // Find user and generate new access token and new refresh token
    const user = await User.findById(storedRefreshToken.userId);
    const payload = { id: user._id, username: user.username };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Update refresh token in database
    await RefreshToken.findOneAndUpdate(
      { token: refreshTokenFromCookie },
      { token: newRefreshToken },
      { new: true }
    );

    // storedRefreshToken.token = newRefreshToken;
    // await storedRefreshToken.save();

    // Set and send new refresh token cookie and access token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true, // cookie is not accessible via Javascript
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days until exp
    });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refresh
};

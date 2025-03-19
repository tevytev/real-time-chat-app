const { User } = require("../../Models/User/User");
const { Status } = require("../../Models/Status/Status");
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
  const { firstName, lastName, email, password } = req.body;

  try {
    // check if user already exists already
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create user
    const newUser = await User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      family: null,
      profilePic: null
    });

    // Create empty user status
    const newStatus = await Status({
      mood: 3,
      feelings: "",
      availability: "",
      thoughts: "",
      user: newUser._id
    });

    // Save user and status to database
    await newUser.save();
    await newStatus.save();

    // Create JWT token and refresh token if the passwords match
    const payload = { id: newUser._id, email: newUser.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    await storeRefreshToken(newUser._id, refreshToken);

    // Set and send new refresh token cookie and access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });

    return res.status(201).json({ newUser });
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
    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    await storeRefreshToken(user._id, refreshToken);

    // Set and send new refresh token cookie and access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });

    // 60 * 60 * 1000 FOR 15 MINUTES
    // 60 * 1000 1 MINUTE

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      res.status(400).json({ message: "No refresh token provided" });
    }

    const deletedToken = await RefreshToken.deleteOne({
      token: refreshTokenFromCookie,
    });

    if (deletedToken.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Refresh token not found or already deleted" });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured while logging out" });
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
    const newRefreshCollection =  await RefreshToken.findOneAndUpdate(
      { token: refreshTokenFromCookie },
      { token: newRefreshToken },
      { new: true }
    );

    // Set and send new refresh token cookie and access token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour until exp
      domain: "real-time-chat-app-server-6rxf.onrender.com",
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {

    // Find the user by email
    const user = await User.findOne({ _id: userId });

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Success" });
    
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
  changePassword
};

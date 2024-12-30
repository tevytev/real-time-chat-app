const { User } = require("../../Models/User/User");
const {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
} = require("./AccessTokenControllers/generateAccessToken");
require("dotenv").config();

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

module.exports = {
  registerUser,
  loginUser,
};

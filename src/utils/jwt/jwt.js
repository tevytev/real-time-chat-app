const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../../Models/RefreshToken/RefreshToken");
require("dotenv").config();

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

const storeRefreshToken = async (userId, refreshToken) => {
  const tokenRecord = await RefreshToken({ userId: userId, token: refreshToken });
  await tokenRecord.save();
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken
};

const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../../../Models/RefreshToken/RefreshToken");
require("dotenv").config();

const generateAccessToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

const storeRefreshToken = async (userId, refreshToken) => {
  const tokenRecord = await RefreshToken({ userId, refreshToken });
  await tokenRecord.save();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
};

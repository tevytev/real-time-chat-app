const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true }
})

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = {
    RefreshToken,
};
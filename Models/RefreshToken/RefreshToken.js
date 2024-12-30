const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
})

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = {
    RefreshToken,
};
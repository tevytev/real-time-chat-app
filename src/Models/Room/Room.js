const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = {
  Room,
}
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
  groupChat: {
    type: Boolean,
    required: true
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dateCreated: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = {
  Room,
}
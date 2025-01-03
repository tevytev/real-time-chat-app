const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User's id
    ref: "User", // Name of the User model
    required: true, // Every message must be associated with a user
  },
  room: {
    type: mongoose.Schema.Types.ObjectId, // Reference to room's id
    ref: "Room", // Name of the Room model
    required: true, // Every message must be associated with a room
  },
  dateCreated: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = {
  Message,
};

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    default: uuidv4, // Automatically generate a unique messageId using UUID
    unique: true, // Make sure the messageId is unique across all messages
    index: true, // Create an index for fast lookups by messageId
  },
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
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

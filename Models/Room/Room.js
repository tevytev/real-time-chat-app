const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    default: uuidv4, // Automatically generate a unique messageId using UUID
    unique: true, // Make sure the messageId is unique across all messages
    index: true, // Create an index for fast lookups by messageId
  },

});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User's id
    ref: "User", // Name of the User model
    required: true, // Every message must be associated with a user
  },
  room: {
    type: mongoose.Schema.Types.ObjectId, // Reference to room's id
    ref: "Room", // Name of the Room model
  },
  livingRoom: {
    type: mongoose.Schema.Types.ObjectId, // Reference to living room's id
    ref: "LivingRoom", // Name of the Living Room model
  },
  dateCreated: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Read by array containing which users have read the message
});

const Message = mongoose.model("Message", messageSchema);
module.exports = {
  Message,
};

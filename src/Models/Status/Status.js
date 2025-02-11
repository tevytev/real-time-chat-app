const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  mood: {
    type: Number,
  },
  feelings: {
    type: String,
  },
  availability: {
    type: String,
  },
  thoughts: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User's id
    ref: "User", // Name of the User model
    required: true, // Every message must be associated with a user
  },
  dateCreated: { type: Date, default: Date.now },
});

const Status = mongoose.model("Status", statusSchema);
module.exports = {
    Status,
};
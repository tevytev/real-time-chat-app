const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  familyAccessCode: {
    type: Number,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User's id
    ref: "User", // Name of the User model
    required: true, // Every message must be associated with a user
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dateCreated: { type: Date, default: Date.now },
});

const Family = mongoose.model("Family", familySchema);
module.exports = {
  Family,
};

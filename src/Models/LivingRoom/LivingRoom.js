const mongoose = require("mongoose");

const livingRoomSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  family: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Family's id
    ref: "Family", // Name of the family model
  },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

const LivingRoom = mongoose.model("LivingRoom", livingRoomSchema);
module.exports = {
    LivingRoom,
}
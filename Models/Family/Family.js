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
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dateCreated: { type: Date, default: Date.now },
});

const Family = mongoose.model("Family", familySchema);
module.exports = {
  Family,
}
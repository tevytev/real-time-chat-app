const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique across all users
      match: /.+\@.+\..+/, // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    family: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Family's id
      ref: "Family", // Name of the family model

    },
    dateCreated: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcyrpt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};

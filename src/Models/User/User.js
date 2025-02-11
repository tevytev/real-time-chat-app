const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true
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
    profilePic: {
      type: String,
    },
    dateCreated: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified('password')) {
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
    // Use bcrypt to compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch; // Return whether the passwords match
  } catch (error) {
    console.error('Error during password comparison:', error);
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};

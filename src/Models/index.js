const mongoose = require("mongoose");
const { User } = require("./User/User");
const { Family } = require("./Family/Family");
const { Room } = require("./Room/Room");

// MongoDB URI
const dbURI =
  "mongodb+srv://tevindcheatham:Bridget1003@cluster0.bpmoe.mongodb.net/";

const db = async () => {
  // establish connection to MongoDB
  await mongoose
    .connect(dbURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
};

module.exports = {
  db,
};

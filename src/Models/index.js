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


  // const room = new Room({
  //   groupChat: false,
  // });

  // const user = await User.findOne({ "username" : "Tevin Cheatham" });

  // room.members.push(user.id);
  // await room.save();

  // Create and save new family
  // const newFamily = new Family({
  //   familyAccessCode: 123,
  //   familyName: "Cheatham family",
  // });

  // await newFamily.save();

  // // Create and save a new user
  // const user1 = new User({
  //   username: "Tevin Cheatham",
  //   email: "Tevd@example.com",
  //   password: "Bridget1003?",
  //   family: newFamily._id,
  // });

  // // Create and save a new user
  // const user2 = new User({
  //   username: "Bridget Cheatham",
  //   email: "Bridget1003@gmail.com",
  //   password: "Bridget1003?",
  //   family: newFamily._id,
  // });

  // // Save the users
  // await user1.save();
  // await user2.save();

  // newFamily.members.push(user1._id);
  // newFamily.members.push(user2._id);
  // await newFamily.save();

};

module.exports = {
  db,
};

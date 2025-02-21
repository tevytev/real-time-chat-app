const mongoose = require("mongoose");
const { Family } = require("../../Models/Family/Family");
const { User } = require("../../Models/User/User");
const { Room } = require("../../Models/Room/Room");
const { Message } = require("../../Models/Message/Message");
const { Status } = require("../../Models/Status/Status");
const { LivingRoom } = require("../../Models/LivingRoom/LivingRoom");

const createFamily = async (req, res) => {
  const { id } = req.user;
  const { familyName } = req.body;

  try {
    // Create new family
    const family = new Family({
      familyName,
      creator: id,
    });

    // Push family creator to family "members" schema and save family to database
    family.members.push(id);
    await family.save();

    // Create new family groupchat
    const familyGroupChat = new LivingRoom({
      family: family._id,
    });

    // Push family creator to the family groupchat "members" schema and save to database
    familyGroupChat.members.push(id);
    await familyGroupChat.save();

    // update user family field
    const updatedUser = await User.findOneAndUpdate(
      { _id: id }, // Find post with null author
      { family: family._id }, // Update with the new ObjectId
      { new: true } // Return the updated post
    );

    // Convert family to an object to append family group chat ID
    const familyToSend = family.toObject();
    familyToSend.livingRoomId = familyGroupChat._id;

    res.status(201).json(familyToSend);
  } catch (error) {
    console.error("Error during family creation:", error);
    res.status(500).json({ message: "Failed to create family" });
  }
};

const getFamily = async (req, res) => {
  const { id } = req.user;
  const { familyId } = req.params;

  try {
    // Find family
    const family = await Family.findById(familyId).exec();

    // Find family group chat
    const familyGroupChat = await LivingRoom.findOne({
      family: family._id,
    });

    // Convert family to an object to append family group chat ID
    const familyToSend = family.toObject();
    familyToSend.livingRoomId = familyGroupChat._id;

    res.status(200).json(familyToSend);
  } catch (error) {
    console.log(error);
  }
};

const getFamilyMembers = async (req, res) => {
  const { id } = req.user;
  const { familyId } = req.params;

  try {
    // Find family by Id
    const family = await Family.findOne({
      _id: familyId,
    });

    // If family is found, send family members array to client
    if (family) {
      const members = [];

      // Iterate through family members in order to push user info to members array
      for (let i = 0; i < family.members.length; i++) {
        // Convert ObjectId into HexString to compare to user Id
        const numberFromObjectId = family.members[i].toHexString();

        // skip users id
        if (numberFromObjectId === id) continue;

        // Look up user info
        const user = await User.findOne({
          _id: family.members[i],
        });

        let memberObj = {
          firstName: user.firstName,
          memberId: user._id,
        };

        members.push(memberObj);
      }

      res.status(200).json(members);
    }
  } catch (error) {
    console.log(error);
  }
};

const joinFamily = async (req, res) => {
  const { id } = req.user;
  const { familyAccessCode, familyName } = req.body;

  try {
    // Find family by id
    const family = await Family.findOne({
      familyName: familyName,
      familyAccessCode: familyAccessCode,
    });
    // If user submitted access code matches family access code push user id to family members

    if (family) {
      if (family.members.includes(id)) return res.status(400).json({ message: "you are already in the family" });
      family.members.push(id);
      await family.save();

      // update user family field
      const updatedUser = await User.findOneAndUpdate(
        { _id: id }, // Find post with null author
        { family: family._id }, // Update with the new ObjectId
        { new: true } // Return the updated post
      );

      for (let i = 0; i < family.members.length; i++) {
        // Convert ObjectId into HexString to compare to user Id
        const numberFromObjectId = family.members[i].toHexString();

        // skip users id
        if (numberFromObjectId === id) continue;

        // Create room
        const room = new Room({
          groupChat: false,
        });

        // Push member ids into new rooms "members" schema
        room.members.push(family.members[i]);
        room.members.push(id);

        // Save room to database
        room.save();
      }

      // Find family group chat
      const familyGroupChat = await LivingRoom.findOne({
        family: family._id,
      });

      // Push user to "members" schema and save to database
      familyGroupChat.members.push(id);
      familyGroupChat.save();

      // Convert family to an object to append family group chat ID
      const familyToSend = family.toObject();
      familyToSend.livingRoomId = familyGroupChat._id;

      res.status(200).json(familyToSend);
    } else {
      throw new Error("Access code invalid");
    }
  } catch (error) {
    console.error("Error while trying to join family :", error);
    res.status(500).json({ message: "Failed to join family" });
  }
};

const leaveFamily = async (req, res) => {
  const { id } = req.user;
  const { familyId } = req.body;

  try {
    // Find and update family members array
    const family = await Family.findByIdAndUpdate(
      { _id: familyId },
      { $pull: { members: id } }, // Pull the memberId out of the members array
      { new: true } // `new: true` returns the updated document
    )
      .then(() => {
        console.log("member reference removed");
      })
      .catch((error) => {
        console.error("error removing comment", error);
      });

    // Find and update family group chat members array
    const familyGroupChat = await LivingRoom.findOneAndUpdate(
      { family: familyId },
      { $pull: { members: id } }, // Pull the memberId out of the members array
      { new: true } // `new: true` returns the updated document
    )
      .then(() => {
        console.log("member reference removed");
      })
      .catch((error) => {
        console.error("error removing comment", error);
      });

    // Find and update user's family field
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id }, // Find user with matching userId
      { family: null }, // update family ID to null
      { new: true } // Return the updated user
    );
    
    // If user is the family creator, pass down creator priviledges to next user in line
    const newFamily = await Family.findById(familyId);
    if (id === newFamily.creator.toHexString() && newFamily.members.length > 0) {
      newFamily.creator = newFamily.members[0];
      await newFamily.save();
    };

    // If there are no more members in the family, delete family and living room from database
    if (newFamily.members.length === 0) {
      await Family.deleteOne({ _id: familyId });
      await LivingRoom.deleteOne({ family: familyId });
    } 

    // Delete all of the user's messages and rooms
    await Message.deleteMany({ user: id });
    await Room.deleteMany({ members: id });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error while trying to leave family :", error);
    res.status(500).json({ message: "Failed to leave family" });
  }
};

const getfamilyStatus = async (req, res) => {
  const { id } = req.user;
  const { familyId } = req.params;
  const statusArray = [];

  try {
    const family = await Family.findById(familyId).exec();
    let members = family.members;

    // Loop through members array to build array
    for (let i = 0; i < members.length; i++) {
      // If userId matching current user skip iteration
      if (id === members[i].toHexString()) continue;

      // Query family member status
      const status = await Status.findOne({ user: members[i] });

      // Query room for current user and current family member
      const room = await Room.find({
        members: { $all: [id, members[i].toHexString()] },
      });

      console.log(room[0]._id);

      // Convert status to an object to append more essential information
      const statusToPush = status.toObject();

      // Query corresponding family member user obj
      const user = await User.findOne({ _id: status.user });

      // Append family member first name and roomId that is shared with user
      statusToPush.firstName = user.firstName;
      statusToPush.roomId = room[0]._id;
      statusToPush.profilePic = user.profilePic;
      console.log(statusToPush);
      statusArray.push(statusToPush);
    }

    res.status(200).json(statusArray);
  } catch (error) {
    console.log(error);
  }
};

const editFamilyName = async () => {};

module.exports = {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
  getfamilyStatus,
  getFamilyMembers,
};

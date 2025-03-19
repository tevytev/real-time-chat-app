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
    console.error("Error fetching family:", error);
    res.status(500).json({ message: "Failed to fetch family" });
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
    console.error("Error fetching family members:", error);
    res.status(500).json({ message: "Failed to fetch family members" });
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
      if (family.members.includes(id))
        return res
          .status(400)
          .json({ message: "you are already in the family" });

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

        // Check if user has an old room from previously being in the family
        const oldRoom = await Room.find({
          members: { $all: [family.members[i].toHexString(), id] },
        });

        // If so, continue
        if (oldRoom.length) continue;

        // Create room
        const room = new Room({});

        // Push member ids into new rooms "members" schema
        room.members.push(family.members[i]);
        room.members.push(id);

        // Save room to database
        await room.save();
      }

      // Find family group chat
      const familyGroupChat = await LivingRoom.findOne({
        family: family._id,
      });

      // Check if user has been in the family group chat
      if (!familyGroupChat.members.includes(id)) {
        // Push user to "members" schema and save to database
        familyGroupChat.members.push(id);
        await familyGroupChat.save();
      }

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
    );

    // Find and update user's family field
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id }, // Find user with matching userId
      { family: null }, // update family ID to null
      { new: true } // Return the updated user
    );

    // If user is the family creator, pass down creator priviledges to next user in line
    const newFamily = await Family.findById(familyId);
    if (
      id === newFamily.creator.toHexString() &&
      newFamily.members.length > 0
    ) {
      newFamily.creator = newFamily.members[0];
      await newFamily.save();
    }

    // If there are no more members in the family, delete family and living room from database
    if (newFamily.members.length === 0) {
      await Family.deleteOne({ _id: familyId });
      await LivingRoom.deleteOne({ family: familyId });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error while trying to leave family :", error);
    res.status(500).json({ message: "Failed to leave family" });
  }
};

const removeFamilyMember = async (req, res) => {
  const { memberId, familyId } = req.body;

  try {
    // Find and update family members array
    const family = await Family.findByIdAndUpdate(
      { _id: familyId },
      { $pull: { members: memberId } }, // Pull the memberId out of the members array
      { new: true } // `new: true` returns the updated document
    );

    // Find and update user's family field
    const updatedUser = await User.findByIdAndUpdate(
      { _id: memberId }, // Find user with matching memberId
      { family: null }, // update family ID to null
      { new: true } // Return the updated user
    );

    // Find family group chat
    const familyGroupChat = await LivingRoom.findOne({
      family: family._id,
    });

    // Convert family to an object to append family group chat ID
    const familyToSend = family.toObject();
    familyToSend.livingRoomId = familyGroupChat._id;

    res.status(200).json(familyToSend);
  } catch (error) {
    console.error("Error removing family member:", error);
    res.status(500).json({ message: "Failed to remove family members" });
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

      // Convert status to an object to append more essential information
      const statusToPush = status.toObject();

      // Query corresponding family member user obj
      const user = await User.findOne({ _id: status.user });

      // Append family member first name and roomId that is shared with user
      statusToPush.firstName = user.firstName;
      statusToPush.roomId = room[0]._id;
      statusToPush.profilePic = user.profilePic;
      statusArray.push(statusToPush);
    }

    res.status(200).json(statusArray);
  } catch (error) {
    console.error("Error fetching family statuses:", error);
    res.status(500).json({ message: "Failed to fetch family statuses" });
  }
};

const editFamily = async (req, res) => {
  const { familyId } = req.params;
  const { accessCode, familyName } = req.body;

  try {
    // Find family using family ID
    const family = await Family.findById(familyId).exec();

    if (accessCode) family.familyAccessCode = accessCode;
    if (familyName) family.familyName = familyName;
    await family.save();

    // Find family group chat
    const familyGroupChat = await LivingRoom.findOne({
      family: family._id,
    });

    // Convert family to an object to append family group chat ID
    const familyToSend = family.toObject();
    familyToSend.livingRoomId = familyGroupChat._id;

    res.status(200).json(familyToSend);
  } catch (error) {
    console.error("Error editing family info:", error);
    res.status(500).json({ message: "Failed to edit family info" });
  }
};

const changeCreator = async (req, res) => {
  const { familyId } = req.params;
  const { memberId } = req.body;

  try {
    // Find family using family ID
    const family = await Family.findById(familyId);

    // Set family creator to member ID and save document
    family.creator = memberId;
    await family.save();

    // Find family group chat
    const familyGroupChat = await LivingRoom.findOne({
      family: family._id,
    });

    // Convert family to an object to append family group chat ID
    const familyToSend = family.toObject();
    familyToSend.livingRoomId = familyGroupChat._id;

    res.status(200).json(familyToSend);
  } catch (error) {
    console.error("Error changing family creator:", error);
    res.status(500).json({ message: "Failed to change family creator" });
  }
};

module.exports = {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
  getfamilyStatus,
  getFamilyMembers,
  removeFamilyMember,
  editFamily,
  changeCreator
};

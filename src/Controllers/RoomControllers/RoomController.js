const express = require("express");
const { Room } = require("../../Models/Room/Room");
const { User } = require("../../Models/User/User");
const { LivingRoom } = require("../../Models/LivingRoom/LivingRoom");

const createRoom = async (req, res) => {
  const members = req.body.members;

  try {
    // Create new room
    const room = new Room({});

    // Push member ids into new rooms "members" schema
    members.forEach((memberId) => {
      room.members.push(memberId);
    });

    // Save room to database
    room.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error during room creation:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

const deleteRoom = async (req, res) => {
  
}

const getActiveRoomUsers = async (req, res) => {
  const { id } = req.user;
  const { roomId } = req.params;

  const users = [];

  try {
    // Find active room
    const room = await Room.findById(roomId).exec();

    // Push each room member in room to "users" array to send to client
    for (let i = 0; i < room.members.length; i++) {
      if (id === room.members[i].toHexString()) continue;
      const user = await User.findById(room.members[i]);
      users.push(user);
    }

    res.status(200).json({ users: users });

  } catch (error) {
    console.log();
  }
}

const getAllRooms = async (req, res) => {
  const { id } = req.user;

  try {
    const rooms = await Room.find({ members: id }).sort({ updatedAt: -1 }).exec();

    if (!rooms) {
      res.status(404).send({ message: "Failed to find rooms" });
    }

    // Convert family to an object to append family group chat ID
    // const roomsToSend = rooms.toObject();

    for (let i = 0; i < rooms.length; i++) {
      const roomObject = rooms[i].toObject();
      for (let j = 0; j < roomObject.members.length; j++) {
        if (roomObject.members[j].toHexString() === id) continue;
        const user = await User.findById(roomObject.members[j]);
        roomObject.firstName = user.firstName;
      }
      rooms[i] = roomObject;
    }

    res.status(200).json(rooms);
    
  } catch (error) {
    console.log(error);
  }
};

const getLivingRommActiveUsers = async (req, res) => {
  const { id } = req.user;
  const { livingRoomId } = req.params;

  const users = [];

  try {
    // Find family group chat
    const familyGroupChat = await LivingRoom.findById(livingRoomId).exec();

    // Push each family member in group chat to "users" array to send to client
    for (let i = 0; i < familyGroupChat.members.length; i++) {
      if (id === familyGroupChat.members[i].toHexString()) continue;
      const user = await User.findById(familyGroupChat.members[i]);
      users.push(user);
    }

    res.status(200).json({ users: users });

  } catch (error) {
    console.log(error);
  }
}


module.exports = {
    createRoom,
    getAllRooms,
    getActiveRoomUsers,
    getLivingRommActiveUsers
}
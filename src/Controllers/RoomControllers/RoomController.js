const express = require("express");
const { Room } = require("../../Models/Room/Room");
const { User } = require("../../Models/User/User"); 

const createRoom = async (req, res) => {
  const members = req.body.members;

  try {
    // Create new room
    const room = new Room({
      groupChat: false,
    });

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

const getActiveRoom = async (req, res) => {
  const { roomId } = req.params;
  const { id } = req.user;

  const users = [];


  try {

    // Find active room
    const room = await Room.findById(roomId).exec();

    // Add each user in the room to array to send back in response
    for (let i = 0; i < room.members.length; i++) {
      const user = await User.findById(room.members[i]);
      users.push(user);
    }

    res.status(200).json({ users: users });

  } catch (error) {
    
  }
}

const getAllRooms = async (req, res) => {
  const { id } = req.user;

  try {
    const rooms = await Room.find({ members: id }).sort({ updatedAt: -1 }).exec();

    if (!rooms) {
      res.status(404).send({ message: "Failed to find rooms" });
    }

    res.status(200).json(rooms);
    
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
    createRoom,
    getAllRooms,
    getActiveRoom
}
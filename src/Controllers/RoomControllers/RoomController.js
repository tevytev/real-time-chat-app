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


module.exports = {
    createRoom,
}
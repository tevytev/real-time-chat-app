const mongoose = require("mongoose");
const { Family } = require("../../Models/Family/Family");

const createFamily = async (req, res) => {
  const { id } = req.user;
  const { familyAccessCode, familyName } = req.body;

  try {
    // Create new family
    const family = new Family({
      familyAccessCode,
      familyName,
    });

    // Push family creator to family members and save family to database
    family.members.push(id);
    await family.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error during family creation:", error);
    res.status(500).json({ message: "Failed to create family" });
  }
};

const joinFamily = async (req, res) => {
  const { id } = req.user;
  const { familyAccessCode, familyId } = req.body;

  try {
    // Find family by id
    const family = await Family.findById(familyId).exec();
    // If user submitted access code matches family access code push user id to family members
    if (family.familyAccessCode === familyAccessCode) {
      family.members.push(id);
      await family.save();
      res.status(200).json({ message: "success" });
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
    const family = await Family.findByIdAndUpdate(
      { _id: familyId },
      { $pull: { members: id } }, // Pull the memberId out of the members array
      { new: true } // `new: true` returns the updated document
    ).then(() => {
      console.log("member reference removed");
    }).catch((error) => {
      console.error("error removing comment", error);
    })
    // await family.save();
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error while trying to leave family :", error);
    res.status(500).json({ message: "Failed to leave family" });
  }
};

module.exports = {
  createFamily,
  joinFamily,
  leaveFamily,
};

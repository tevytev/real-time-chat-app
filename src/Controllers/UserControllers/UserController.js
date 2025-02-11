const { User } = require("../../Models/User/User");
const { Status } = require("../../Models/Status/Status");

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  console.log(user);
  res.status(201).json(user);
};

const getUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const status = await Status.findOne({ user: userId });
    console.log(status);
    res.status(200).json(status);
  } catch (error) {
    console.log(error);
  }
};

const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { mood, feelings, availability, thoughts } = req.body;

  try {
    const newStatus = await Status.findOneAndUpdate(
      { user: userId },
      {
        mood: mood,
        feelings: feelings,
        availability: availability,
        thoughts: thoughts,
      },
      { new: true }
    );

    res.status(200).json(newStatus);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUser,
  getUserStatus,
  updateUserStatus,
};

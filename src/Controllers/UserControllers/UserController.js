const { User } = require("../../Models/User/User");
const { Status } = require("../../Models/Status/Status");

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  res.status(201).json(user);
};

const getUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const status = await Status.findOne({ user: userId });
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ message: "Failed to fetch user status" });
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
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email } = req.body;

  try {

    const user = await User.findOne({ _id: userId });

    const newUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName: firstName !== "" ? firstName : user.firstName,
        lastName: lastName !== "" ? lastName : user.lastName,
        email: email !== "" ? email : user.email,
      },
      { new: true }
    );
    
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error editing user info:", error);
    res.status(500).json({ message: "Failed to update user info" });
  }
};

module.exports = {
  getUser,
  getUserStatus,
  updateUserStatus,
  updateUserInfo
};

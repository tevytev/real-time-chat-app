const { User } = require("../../Models/User/User");

const getUser = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ "username" : username }, "username email");
    console.log(user);
    res.status(201).json({ message: "success" });

};

module.exports = {
    getUser
}
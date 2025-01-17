const { User } = require("../../Models/User/User");

const getUser = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ "_id" : userId }, "username email");
    console.log(user);
    res.status(201).json(user);

};

module.exports = {
    getUser
}
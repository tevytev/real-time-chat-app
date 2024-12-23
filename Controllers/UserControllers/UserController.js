const { User } = require("../../Models/User/User");

const getUser = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ "username" : username }, "username email");
    console.log(user);
    res.json(user);
}

module.exports = {
    getUser
}
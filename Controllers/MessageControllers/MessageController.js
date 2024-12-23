

const getMessage = async (req, res) => {
    res.status(200).send("this is a message from the controller");
}

module.exports = {
    getMessage,
}
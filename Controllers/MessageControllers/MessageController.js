const { Message } = require("../../Models/Message/Message");
const { Room } = require("../../Models/Room/Room");

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  const { skip = 0, limit = 20 } = req.query;
  try {
    // Find messages with query to distinguish what messages to skip and the limited amount to send to client
    const messages = await Message.find({ room: roomId })
      .sort("createdAt")
      .skip(Number(skip))
      .limit(Number(limit));
    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Failed to fetch message" });
  }
};

const createMessage = async (req, res) => {
  const { id } = req.user;
  const { roomId, messageContent } = req.body;

  try {
    // Look up and verify particular room that the user message is being sent to
    const room = await Room.findById(roomId).exec();

    // if room not found send error
    if (!room) {
      res.status(404).send({ message: "Failed to save message" });
    }
    // Create and save new message to database
    const newMessage = await Message({
      content: messageContent,
      user: id,
      room: roomId,
    });
    const savedMessage = await newMessage.save();

    // Message save success
    if (savedMessage) {
      res.status(201).json({ message: "success" });
    }
  } catch (error) {
    console.error("Error during message:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};

module.exports = {
  getMessages,
  createMessage,
};

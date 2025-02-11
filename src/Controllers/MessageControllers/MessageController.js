const { Message } = require("../../Models/Message/Message");
const { Room } = require("../../Models/Room/Room");
const { LivingRoom } = require("../../Models/LivingRoom/LivingRoom");

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  const { skip = 0, limit = 20 } = req.query;
  
  try {
    // Find messages with query to distinguish what messages to skip and the limited amount to send to client
    const messages = await Message.find({ room: roomId })
      .sort({ dateCreated: -1 })
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
  const { roomId } = req.params;
  const { messageContent } = req.body;

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

    newMessage.readBy.push(id);

    const savedMessage = await newMessage.save();
    room.updatedAt = Date.now();
    await room.save();

    // Message save success
    if (savedMessage) {
      res.status(201).json({ message: newMessage });
    }
  } catch (error) {
    console.error("Error during message:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};

const getLivingRoomMessages = async (req, res) => {
  const { livingRoomId } = req.params;
  const { skip = 0, limit = 20 } = req.query;

  try {
    // Find messages with query to distinguish what messages to skip and the limited amount to send to client
    const messages = await Message.find({ livingRoom: livingRoomId })
      .sort({ dateCreated: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Failed to fetch message" });
  }
}

const createLivingRoomMessage = async (req, res) => {
  const { id } = req.user;
  const { livingRoomId } = req.params;
  const { messageContent } = req.body;

  try {
    // Look up and verify particular room that the user message is being sent to
    const livingRoom = await LivingRoom.findById(livingRoomId).exec();

    // if room not found send error
    if (!livingRoom) {
      res.status(404).send({ message: "Failed to save message" });
    }
    // Create and save new message to database
    const newMessage = await Message({
      content: messageContent,
      user: id,
      livingRoom: livingRoomId,
    });

    const savedMessage = await newMessage.save();
    livingRoom.updatedAt = Date.now();
    await livingRoom.save();

    // Message save success
    if (savedMessage) {
      res.status(201).json({ message: newMessage });
    }
  } catch (error) {
    console.error("Error during message:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const { id } = req.user;
  const { roomId } = req.params;

  try {

    const messages = await Message.updateMany(
      { room: roomId, 'readBy': { $ne: id } },
      { $push: { readBy: id } }
    );
    
    res.status(200).json(messages);

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getMessages,
  getLivingRoomMessages,
  createMessage,
  createLivingRoomMessage,
  markMessagesAsRead,
};

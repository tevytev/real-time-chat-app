const app = require("express")();
const options = {
  /* ... */
};
const { db } = require("./Models/index");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const expressServer = app.listen(PORT, () => {
  console.log(`Server is connected to ${PORT}`);
});
const io = new Server(expressServer, {
  cors: {
    origin: ["http://localhost:5173/"],
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Handle incoming connections
io.on("connection", (socket) => {
  console.log("a user connected");
});

db();
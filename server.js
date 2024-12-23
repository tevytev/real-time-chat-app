const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const { db } = require("./Models/index");
const messageRoutes = require("./Routes/messageRoutes");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// message routes
app.use("/api/message", messageRoutes);

// user routes
app.use("/api/user", userRoutes);

// auth routes
app.use("/api/auth", authRoutes);

const expressServer = app.listen(PORT, () => {
  console.log(`Server is connected to ${PORT}`);
});
/*["http://localhost:5173/"]*/
const corsOptions = {
  origin: "*",
  methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: [
    "Set-Cookie",
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "withCredentials",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

const io = new Server(expressServer, {
  cors: corsOptions,
});

// Handle incoming connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // User joins a room
  socket.on("joinRoom", (roomName) => {
    console.log(`${socket.id} joined room: ${roomName}`);
    socket.join(roomName);
    io.to(roomName).emit(
      "message",
      `A new user has joined the room: ${roomName}`
    );
  });

  // Listen for a message from a specific room
  socket.on("message", (roomName, message) => {
    io.to(roomName).emit("message", message);
    console.log(
      `${socket.id} is in room: ${roomName} and just sent the message ${message}`
    );
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

db();

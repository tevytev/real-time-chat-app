const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { Server } = require("socket.io");
const { db } = require("./Models/index");
const messageRoutes = require("./Routes/messageRoutes");
const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const roomRoutes = require("./Routes/roomRoutes");
const familyRoutes = require("./Routes/familyRoutes");

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// ["http://localhost:5173/"]
const corsOptions = {
  origin: "http://localhost:5173",
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

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow your origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD'); // Allow methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Set-Cookie, withCredentials'); // Allow headers
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, headers)
  res.sendStatus(200); // OK response for preflight
});

const PORT = process.env.PORT || 3000;

// message routes
app.use("/api/message", messageRoutes);

// room routes
app.use("/api/room", roomRoutes);

// user routes
app.use("/api/user", userRoutes);

// family routes
app.use("/api/family", familyRoutes);

// auth routes
app.use("/api/auth", authRoutes);

const expressServer = app.listen(PORT, () => {
  console.log(`Server is connected to ${PORT}`);
});

const io = new Server(expressServer, {
  cors: corsOptions,
});

// Handle incoming connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // Listen for a user joining a room
  socket.on("joinRoom", (roomId) => {
    console.log(`${socket.id} joined room: ${roomId}`);

    // User joins room
    socket.join(roomId);

    // Broadcast to other all other clients in room that user has joined room
    io.to(roomId).emit(
      "message",
      `A new user has joined the room: ${roomId}`
    );
  });

  // Listen for a message from a specific room
  socket.on("sendMessage", (roomId, message) => {
    
    // Broadcast message to all other clients in room
    io.to(roomId).emit("receiveMessage", message);

    console.log(
      `${socket.id} is in room: ${roomId} and just sent the message ${message}`
    );
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

db();
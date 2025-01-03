import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import axios from "./api/axios";
const URL = "/api/message/67738646d80c810aa89bda41"



const socket = io("http://localhost:5432/", { transports: ["websocket"] });
socket.emit("joinRoom", '67675390bb53a376a773d025');
function App() {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState(["heyyy", "how are you!"]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState('67675390bb53a376a773d025')

  useEffect(() => {
    // Listen for the 'message' event from the server
    socket.on("serverMessage", (data) => {
      console.log("Received from server:", data);
      setMessages((prevMessages) => [...prevMessages, data.text]);
    });

    return () => {
      socket.off("message");
    };
  }, []);
  console.log(messages)

  return (
    <>
      <div className="container">
        <div className="msgs-container">
          {messages.map((message) => { return <div className="msg">{message}</div>})}
        </div>
        <input id="message" type="text" />
        <input
          onClick={() => {
            const message = document.getElementById("message").value;
            socket.emit("message", room, message);
            document.getElementById("message").value = "";
          }}
          type="submit"
        />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

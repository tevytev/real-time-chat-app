import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import io from "socket.io-client";

// const socket = io("http://localhost:5432/", { transports: ["websocket"] });

function test() {
  let count = 1;
  const interval = setInterval(() => {
    console.log(count++);
    if (count == 10) clearInterval(interval);
  }, 11000);
  setTimeout(() => {
    socket.emit("joinRoom", "67675390bb53a376a773d025");
    socket.emit(
      "message",
      "67675390bb53a376a773d025",
      "Hey this is a message that I sent to the room!"
    );
  }, 10000);
}

function App() {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState('67675390bb53a376a773d025')

  const socket = io("http://localhost:5432/", { transports: ["websocket"] });
  socket.emit("joinRoom", room);

  useEffect(() => {
    // Listen for the 'message' event from the server
    socket.on("clientMessage", (data) => {
      console.log("Received from server:", data);
      setMessages((prevMessages) => [...prevMessages, data.text]);
    });
    console.log(messages)

    return () => {
      socket.off("message");
    };
  }, [messages]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
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

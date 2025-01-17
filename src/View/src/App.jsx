import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserProvider } from "./routes/userContext/UserContext";
import "./App.css";
import Auth from "./routes/auth/Auth";
import Root from "./routes/Root";
import Dashboard from "./routes/dashboard/Dashboard";
import io from "socket.io-client";
import axios from "./api/axios";
const URL = "/api/message/67738646d80c810aa89bda41";

function App() {

  // const [messages, setMessages] = useState(["heyyy", "how are you!"]);
  // const [room, setRoom] = useState("67675390bb53a376a773d025");

  // useEffect(() => {
  //   // Listen for the 'message' event from the server
  //   socket.on("serverMessage", (data) => {
  //     console.log("Received from server:", data);
  //     setMessages((prevMessages) => [...prevMessages, data.text]);
  //   });

  //   return () => {
  //     socket.off("message");
  //   };
  // }, []);

  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/register" element={<Auth />} />
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
      </UserProvider>
    </>
  );
}

export default App;

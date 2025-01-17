import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import Header from "../../components/Header/Header";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import axios from "../../api/axios";
const ROOM_URL = "/api/room/all";

import "./Dashboard.css";

export default function Dashboard() {

    // navigation function
  const navigate = useNavigate();

  const { user, setUser, rooms, setRooms } = useContext(UserContext);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Effect to fetch all the users rooms
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      
      const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const response = await axios.get(ROOM_URL, {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              });

              if (response.status === 200) {
                const roomData = response.data;
                setRooms(roomData);
                setLoadingRooms(false);
              };

        } catch (error) {
          if (!error?.response) {
            console.log('No Server Response');
        } else if (error.response?.status === 400) {
            console.log('Missing username or password');
        } else if (error.response?.status === 401) {
            localStorage.removeItem("user");
        } else {
            console.log('Login failed');
        };
        }
    }

    fetchRooms();
    } else {
        navigate("/register");
    }
  }, [activeRoomId, rooms]);
  

  if (user) {
    return (
      <>
        <section className="dashboard-container">
          <Header
            user={user}
          />
          <div className="dashboard-chat-container">
            <ChatList loadingRooms={loadingRooms} user={user} rooms={rooms} activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} />
            <ChatRoom loadingRooms={loadingRooms} user={user} activeRoomId={activeRoomId} />
          </div>
        </section>
      </>
    );
  }
}

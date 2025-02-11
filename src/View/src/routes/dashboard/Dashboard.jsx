import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import Header from "../../components/Header/Header";
import ChatList from "../../components/Conversations/ChatList/ChatList";
import ChatRoom from "../../components/Conversations/ChatRoom/ChatRoom";
import StatusList from "../../components/StatusList/StatusList";
import UserStatus from "../../components/UserStatus/UserStatus";
import LivingRoom from "../../components/LivingRoom/LivingRoom";
import Settings from "../../components/Settings/Settings";
import axios from "../../api/axios";
const ROOM_URL = "/api/room/all";

import "./Dashboard.css";

export default function Dashboard() {
  // navigation function
  const navigate = useNavigate();

  const { user, setUser, rooms, setRooms, activeTab, setActiveTab } =
    useContext(UserContext);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Effect to fetch all the users rooms
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoadingRooms(true);
      fetchRooms();
      setLoadingRooms(false);
    } else {
      navigate("/register");
    }
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(ROOM_URL, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const roomData = response.data;
        console.log(roomData);
        setRooms(roomData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && activeTab === "inbox") {
    return (
      <>
        <section className="dashboard-container">
          <Header />
          <div className="dashboard-chat-container">
            <ChatList
              loadingRooms={loadingRooms}
              user={user}
              rooms={rooms}
              activeRoomId={activeRoomId}
              setActiveRoomId={setActiveRoomId}
              fetchRooms={fetchRooms}
            />
            <ChatRoom
              fetchRooms={fetchRooms}
              loadingRooms={loadingRooms}
              user={user}
              activeRoomId={activeRoomId}
            />
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "status") {
    return (
      <>
        <section className="dashboard-container">
          <Header />
          <div className="dashboard-status-container">
            <UserStatus />
            <StatusList setActiveRoomId={setActiveRoomId} />
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "familyChat") {
    return (
      <>
        <section className="dashboard-container">
          <Header />
          <div className="dashboard-status-container">
            <LivingRoom />
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "settings") {
    return (
      <>
        <section className="dashboard-container">
          <Header />
          <div className="dashboard-status-container">
            <Settings />
          </div>
        </section>
      </>
    );
  }
}

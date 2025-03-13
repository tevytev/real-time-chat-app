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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useEffect(() => {
    // Function to update window width state
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    // Attach the event listener to window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const userHeader = document.getElementById("header-user");
    if (userHeader.classList.contains("header-user-status-container-active")) {
      if (windowWidth > 1024) {
        handleToggleChats();
      }
    }
  }, [windowWidth]);

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
        setRooms(roomData);
      }
    } catch (error) {
      if (!error?.response) {
        console.log("No server response");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("family");
        navigate("/register");
      }
    }
  };

  const handleToggleChats = (e) => {
    const userHeader = document.getElementById("header-user");
    const dashHeader = document.getElementById("dash-header");
    const chatList = document.getElementById("chat-list");
    const backdrop = document.getElementById("chat-backdrop");
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    const userStatus = document.getElementById("user-status");

    if (burger.checked === false) burger.checked = true;
    else burger.checked = false;

    if (!nav.classList.contains("unclickable"))
      nav.classList.add("unclickable");
    else nav.classList.remove("unclickable");

    if (userHeader.classList.contains("header-user-status-container")) {
      userHeader.classList.replace(
        "header-user-status-container",
        "header-user-status-container-active"
      );

      dashHeader.classList.replace(
        "header-container",
        "header-container-active"
      );
    } else {
      userHeader.classList.replace(
        "header-user-status-container-active",
        "header-user-status-container"
      );
      dashHeader.classList.replace(
        "header-container-active",
        "header-container"
      );
    }

    if (chatList && chatList.classList.contains("chat-list-container"))
      chatList.classList.replace(
        "chat-list-container",
        "chat-list-container-active"
      );
    else if (chatList)
      chatList.classList.replace(
        "chat-list-container-active",
        "chat-list-container"
      );

    if (userStatus && userStatus.classList.contains("user-status-container"))
      userStatus.classList.replace(
        "user-status-container",
        "user-status-container-active"
      );
    else if (userStatus)
      userStatus.classList.replace(
        "user-status-container-active",
        "user-status-container"
      );

    if (backdrop.classList.contains("chat-backdrop-hidden") && backdrop)
      backdrop.classList.replace("chat-backdrop-hidden", "chat-backdrop");
    else if (backdrop)
      backdrop.classList.replace("chat-backdrop", "chat-backdrop-hidden");
  };

  if (user && activeTab === "inbox") {
    return (
      <>
        <section className="dashboard-container">
          <Header handleToggleChats={handleToggleChats} />
          <div className="dashboard-chat-container">
            <ChatList
              loadingRooms={loadingRooms}
              user={user}
              rooms={rooms}
              setRooms={setRooms}
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
            <div
              onClick={handleToggleChats}
              id="chat-backdrop"
              className="chat-backdrop-hidden fade-in"
            ></div>
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "status") {
    return (
      <>
        <section className="dashboard-container">
          <Header handleToggleChats={handleToggleChats} />
          <div className="dashboard-status-container">
            <UserStatus />
            <StatusList setActiveRoomId={setActiveRoomId} />
            <div
              onClick={handleToggleChats}
              id="chat-backdrop"
              className="chat-backdrop-hidden fade-in"
            ></div>
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "familyChat") {
    return (
      <>
        <section className="dashboard-container">
          <Header handleToggleChats={handleToggleChats} />
          <div className="dashboard-status-container">
            <LivingRoom />
            <div
              onClick={handleToggleChats}
              id="chat-backdrop"
              className="chat-backdrop-hidden fade-in"
            ></div>
          </div>
        </section>
      </>
    );
  } else if (user && activeTab === "settings") {
    return (
      <>
        <section className="dashboard-container">
          <Header handleToggleChats={handleToggleChats} />
          <div className="dashboard-status-container">
            <Settings />
            <div
              onClick={handleToggleChats}
              id="chat-backdrop"
              className="chat-backdrop-hidden fade-in"
            ></div>
          </div>
        </section>
      </>
    );
  }
}

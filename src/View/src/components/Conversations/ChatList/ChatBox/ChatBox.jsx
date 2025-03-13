import { useState, useEffect, useLayoutEffect } from "react";
import "./ChatBox.css";
import axios from "../../../../api/axios";
import io from "socket.io-client";
const USER_URL = "/api/user/";
const MESSAGE_URL = "/api/message/";

// Websocket
const socket = io("http://localhost:5432/", { transports: ["websocket"] });

export default function ChatBox(props) {
  const {
    rooms,
    roomId,
    activeRoomId,
    setActiveRoomId,
    filteredRoom,
    upadtedAt,
    user,
    searchTerm,
  } = props;

  const [roomUser, setRoomUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState("");
  const [pfp, setPfp] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useLayoutEffect(() => {
    setLastMessage("");
    setUnreadCount(0);
    socket.emit("joinRoom", roomId);
  }, [user, roomId]);

  useEffect(() => {
    const fetchRoomUser = async () => {
      try {
        const response = await axios.get(`${USER_URL}${filteredRoom[0]}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setRoomUser(response.data);
        setPfp(response.data.profilePic);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoomUser();
  }, [rooms, searchTerm]);

  // Fetch and convert updated time of chat box
  useEffect(() => {
    // Convert the ISO string to a Date object
    const date = new Date(upadtedAt);

    // Extract hours, minutes, and period (AM/PM)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12; // Adjust to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Add leading zero to minutes if necessary
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Construct the final 12-hour time format
    const time12Hour = `${hours}:${minutes} ${ampm}`;
    setLastUpdated(time12Hour);
  }, [rooms, user]);

  // Fetch recent messages to set lastMessage and unread states
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await axios.get(`${MESSAGE_URL}${roomId}?limit=10`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          // Message data received from server
          const messageData = response.data;

          // If no message history, return
          if (!messageData.length) return;

          // Set last message state to last message in received message data
          if (messageData.length) setLastMessage(messageData[0]);

          // Reset unread count state before updating it according to received message data from server side
          setUnreadCount(0);

          // If the last message was not read by current user then loop through each message to update unread count state accordingly
          if (!messageData[0].readBy.includes(user.userId)) {
            for (let i = 0; i < messageData.length; i++) {
              if (messageData[i].readBy.length < 2)
                setUnreadCount((prevCount) => prevCount + 1);
              if (unreadCount > 9) {
                setUnreadCount("+9");
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentMessages();
  }, [rooms, user]);

  // Websocket effect to update messages state in real-time
  useEffect(() => {
    // Listen for the 'message' event from the server
    socket.on("receiveMessage", (data) => {
      // Update the messages state with the new message if the new message is from chatbox users
      if (data.room === roomId) {
        setLastMessage(data);
        if (activeRoomId !== roomId && unreadCount !== "+9") {
          if (unreadCount === 9) setUnreadCount("+9");
          else setUnreadCount((prevCount) => prevCount + 1);
        }
      }
    });

    return () => {
      socket.off("receiveMessage"); // Clean up when the component unmounts
    };
  }, [socket]);

  const handleReadMessages = async () => {
    try {
      const response = await axios.post(`${MESSAGE_URL}read/${roomId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setUnreadCount(0);
        // console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseChats = () => {
    const userHeader = document.getElementById("header-user");
    const dashHeader = document.getElementById("dash-header");
    const chatList = document.getElementById("chat-list");
    const backdrop = document.getElementById("chat-backdrop");
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");

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

    if (backdrop.classList.contains("chat-backdrop-hidden") && backdrop)
      backdrop.classList.replace("chat-backdrop-hidden", "chat-backdrop");
    else if (backdrop)
      backdrop.classList.replace("chat-backdrop", "chat-backdrop-hidden");
  };

  if (roomUser) {
    if (activeRoomId === roomId) {
      return (
        <>
          <li id={roomId} className="chatbox-container-active">
            <div className="chatbox-pfp-container">
              <div>
                {pfp ? (
                  <img src={pfp} alt="" />
                ) : (
                  roomUser.firstName[0].toUpperCase()
                )}
              </div>
            </div>
            <div className="chatbox-text-container-active">
              <h1>{roomUser.firstName}</h1>
              <p>
                {lastMessage !== ""
                  ? lastMessage.content
                    ? lastMessage.content
                    : "Sent an image"
                  : ""}
              </p>
            </div>
            <div className="chatbox-notification-container-active">
              <p>{lastUpdated}</p>
            </div>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li
            id={roomId}
            onClick={(e) => {
              setActiveRoomId(roomId);
              handleReadMessages();
              if (windowWidth <= 1024) handleCloseChats();
            }}
            className="chatbox-container"
          >
            <div className="chatbox-pfp-container">
              <div>
                {pfp ? (
                  <img src={pfp} alt="" />
                ) : (
                  roomUser.firstName[0].toUpperCase()
                )}
              </div>
            </div>
            <div className="chatbox-text-container">
              <h1>{roomUser.firstName}</h1>
              <p className={unreadCount ? "bold-lastmsg" : ""}>
                {/* {lastMessage
                  ? lastMessage.content
                    ? lastMessage.content
                    : "Sent an image"
                  : ""} */}
                {lastMessage !== ""
                  ? lastMessage.content
                    ? lastMessage.content
                    : lastMessage.image
                    ? "Sent an image"
                    : ""
                  : ""}
              </p>
            </div>
            <div className="chatbox-notification-container">
              {unreadCount > 0 || unreadCount === "9+" ? (
                <div>{unreadCount}</div>
              ) : (
                <></>
              )}
              <p>{lastUpdated}</p>
            </div>
          </li>
        </>
      );
    }
  } else {
    return (
      <>
        <div className="loading-chat-box-container">
          <div className="loading-chat-box-pfp"></div>
          <div className="loading-chatbox-text-container">
            <div className="loading-chatbox-text1"></div>
            <div className="loading-chatbox-text2"></div>
          </div>
          <div className="loading-chatbox-notification"></div>
        </div>
      </>
    );
  }
}

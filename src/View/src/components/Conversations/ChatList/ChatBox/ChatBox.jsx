import { useState, useEffect, useLayoutEffect } from "react";
import "./ChatBox.css";
import axios from "../../../../api/axios";
import { use } from "react";
const USER_URL = "/api/user/";
const MESSAGE_URL = "/api/message/";

export default function ChatBox(props) {
  const {
    rooms,
    roomId,
    activeRoomId,
    setActiveRoomId,
    filteredRoom,
    upadtedAt,
    user,
  } = props;

  const [roomUser, setRoomUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState("");
  const [pfp, setPfp] = useState(null);

  useLayoutEffect(() => {
    setLastMessage("");
    setUnreadCount(0);
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
  }, [rooms]);


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
  }, [rooms]);

  // Fetch recent messages to set lastMessage and unread states
  useEffect(() => {

    const fetchRecentMessages = async () => {

      try {

        const response = await axios.get(`${MESSAGE_URL}${roomId}?limit=10`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        });

        if (response.status === 200) {
          const messageData = response.data;
          if (!messageData.length) return;
          setLastMessage(messageData[0]);
          setUnreadCount(0);
          if (!messageData[0].readBy.includes(user.userId)) {
            for (let i = 0; i < messageData.length; i++) {
              if (messageData[i].readBy.length < 2) setUnreadCount((prevCount) => prevCount + 1);
            }
          }
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecentMessages();

  }, [rooms]);

  const handleReadMessages = async () => {


    try {
      
      const response = await axios.post(`${MESSAGE_URL}read/${roomId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setUnreadCount(0);
        console.log(response);
      }

    } catch (error) {
      console.log(error);
    }
  }

  if (roomUser) {
    if (activeRoomId === roomId) {
      return (
        <>
          <div id={roomId} className="chatbox-container-active">
            <div className="chatbox-pfp-container">
            <div>
                {pfp ? <img src={pfp} alt="" /> : roomUser.firstName[0].toUpperCase()}
              </div>
            </div>
            <div className="chatbox-text-container-active">
              <h1>{roomUser.firstName}</h1>
              <p>{lastMessage.content}</p>
            </div>
            <div className="chatbox-notification-container-active">
              <p>{lastUpdated}</p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            id={roomId}
            onClick={(e) => {
              setActiveRoomId(roomId);
              handleReadMessages();
            }}
            className="chatbox-container"
          >
            <div className="chatbox-pfp-container">
              <div>
                {pfp ? <img src={pfp} alt="" /> : roomUser.firstName[0].toUpperCase()}
              </div>
            </div>
            <div className="chatbox-text-container">
              <h1>{roomUser.firstName}</h1>
              <p className={unreadCount ? "bold-lastmsg" : ""}>{lastMessage.content}</p>
            </div>
            <div className="chatbox-notification-container">
              {unreadCount > 0 ? <div>{unreadCount}</div> : <></>}
              <p>{lastUpdated}</p>
            </div>
          </div>
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

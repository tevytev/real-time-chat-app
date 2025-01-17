import { useState, useEffect } from "react";
import "./ChatBox.css";
import axios from "../../../api/axios";
import { use } from "react";
const USER_URL = "/api/user/";

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
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoomUser();
  }, [rooms]);

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

  if (roomUser) {
    if (activeRoomId === roomId) {
      return (
        <>
          <div id={roomId} className="chatbox-container-active">
            <div className="chatbox-pfp-container">
              <div>{roomUser.username[0].toUpperCase()}</div>
            </div>
            <div className="chatbox-text-container-active">
              <h1>{roomUser.username}</h1>
              <p>Whats up son!</p>
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
            }}
            className="chatbox-container"
          >
            <div className="chatbox-pfp-container">
              <div>{roomUser.username[0].toUpperCase()}</div>
            </div>
            <div className="chatbox-text-container">
              <h1>{roomUser.username}</h1>
              <p>wassam my guy</p>
            </div>
            <div className="chatbox-notification-container">
              <p>{lastUpdated}</p>
              {/* <div>2</div> */}
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

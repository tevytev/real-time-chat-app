import {
  useEffect,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import UserMessage from "../../Message/UserMessage/UserMessage";
import ReceivedMessage from "../../Message/ReceivedMessage/ReceivedMessage";
import { UserContext } from "../../../routes/userContext/UserContext";
import "./ChatRoom.css";
import axios from "../../../api/axios";
import io from "socket.io-client";
const MESSAGE_URL = "/api/message/";
const ROOM_URL = "/api/room/";

// Websocket
const socket = io("http://localhost:5432/", { transports: ["websocket"] });

export default function ChatRoom(props) {
  const { activeRoomId, loadingRooms, fetchRooms } = props;

  const { user } = useContext(UserContext);

  const [activeRoomUsers, setActiveRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [skip, setSkip] = useState(0);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);

  // Reference to chat window
  const chatWindowRef = useRef(null);

  // Update scroll position when the element is scrolled
  const handleScroll = () => {
    if (chatWindowRef.current) {
      const scrollTop = chatWindowRef.current.scrollTop;
      setScrollPosition(scrollTop); // Update scroll position state
    }
  };
  // Effect to add scroll event listener to chat window
  useEffect(() => {
    const element = chatWindowRef.current;

    if (element) {
      // Attach the scroll event listener
      element.addEventListener("scroll", handleScroll);

      // Cleanup the event listener when the component unmounts
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [activeRoomUsers]); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // reset noMoreMessage state
    setNoMoreMessages(false);
    setNewMessages([]);
    setLoadingMoreMessages(false);
    setMessages([]);
  }, [activeRoomId]);

  useEffect(() => {
    if (scrollPosition === 0 && messages.length >= 20) {
      const fetchMoreMessages = async () => {
        try {
          setLoadingMoreMessages(true);
          const response = await axios.get(
            `${MESSAGE_URL}${activeRoomId}?skip=${skip}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            const messageData = response.data;
            if (messageData.length < 20) setNoMoreMessages(true);
            setMessages((prevMessages) => [
              ...messageData.reverse(),
              ...prevMessages,
            ]);
            setLoadingMoreMessages(false);
            setSkip((prev) => prev + 20);
          }
        } catch (error) {
          console.log(error);
        }
      };

      if (messages.length && !noMoreMessages) fetchMoreMessages();
    }

    return () => {};
  }, [scrollPosition]);

  // Fetch all room users and messages
  useEffect(() => {
    // reset skip for fetching old messages
    setSkip(20);

    setLoadingMessages(true);
    const fetchRoomUsers = async () => {
      try {
        const response = await axios.get(`${ROOM_URL}${activeRoomId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const filteredUsers = response.data.users.filter((roomUser) => {
            return roomUser._id !== user.userId;
          });
          console.log(filteredUsers)
          setActiveRoomUsers(filteredUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${MESSAGE_URL}${activeRoomId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const messageData = response.data;
          setMessages(messageData.reverse());
          setLoadingMessages(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (activeRoomId !== null) {
      socket.emit("joinRoom", activeRoomId);
    }

    if (activeRoomId) fetchRoomUsers(), fetchMessages();
  }, [activeRoomId]);

  // Websocket effect to update messages state in real-time
  useEffect(() => {
    // Listen for the 'message' event from the server
    socket.on("receiveMessage", (data) => {
      console.log("Received message from server:", data);

      // Update the messages state with the new message
      setNewMessages((prevMessages) => [
        ...prevMessages,
        data, // Append the new message object
      ]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up when the component unmounts
    };
  }, [socket]);

  // Scroll to bottom of chat window when message is sent/received or the user switches chats
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [newMessages]);

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [activeRoomUsers]); // Trigger when messages change

  // Handle send message
  const handleSendMessage = async (e) => {
    const input = document.getElementById("message-input");
    const message = input.value;

    const body = {
      messageContent: message,
    };

    try {
      const response = await axios.post(
        `${MESSAGE_URL}create/${activeRoomId}`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        // created message to send to websocket
        const createdMessage = response.data.message;
        // emit message to all active room users
        socket.emit("sendMessage", activeRoomId, createdMessage);
        // clear input
        input.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [newMessages]);

  if (activeRoomUsers.length) {
    return (
      <>
        <section className="chat-window-container">
          <header className="chat-window-header">
            <div className="chat-room-info-container">
              <div className="chat-room-info-pfp">
                {activeRoomUsers[0].profilePic ? <img src={activeRoomUsers[0].profilePic} alt="" /> : activeRoomUsers[0].firstName[0].toUpperCase()}
              </div>
              <div className="chat-room-info-text-container">
                <h2>{activeRoomUsers[0].firstName}</h2>
              </div>
            </div>
          </header>
          <div
            id="chat-window"
            ref={chatWindowRef}
            className="chat-window-scroll-container"
          >
            {loadingMoreMessages ? (
              <div className="loading-more-chat-window-scroll-container">
                <div class="loader"></div>
              </div>
            ) : null}
            {loadingMessages ? (
              <div className="loading-chat-window-scroll-container">
                <div class="loader"></div>
              </div>
            ) : (
              messages.map((messageObj, index) => {
                if (messageObj.user !== user.userId) {
                  const date = new Date(messageObj.dateCreated);
                  // Get hours and minutes
                  let hours = date.getHours();
                  const minutes = String(date.getMinutes()).padStart(2, "0");

                  // Convert to 12-hour format and adjust AM/PM
                  const ampm = hours >= 12 ? "PM" : "AM";
                  hours = hours % 12;
                  hours = hours ? hours : 12; // Hour "0" becomes "12" in 12-hour format

                  // Format time without leading zero
                  const formattedTime = `${hours}:${minutes} ${ampm}`;

                  return (
                    <>
                      <ReceivedMessage
                        username={activeRoomUsers[0].firstName}
                        key={index}
                        time={formattedTime}
                        text={messageObj.content}
                      />
                    </>
                  );
                } else {
                  const date = new Date(messageObj.dateCreated);

                  // Get hours and minutes
                  let hours = date.getHours();
                  const minutes = String(date.getMinutes()).padStart(2, "0");

                  // Convert to 12-hour format and adjust AM/PM
                  const ampm = hours >= 12 ? "PM" : "AM";
                  hours = hours % 12;
                  hours = hours ? hours : 12; // Hour "0" becomes "12" in 12-hour format

                  // Format time without leading zero
                  const formattedTime = `${hours}:${minutes} ${ampm}`;
                  return (
                    <>
                      <UserMessage
                        key={index}
                        time={formattedTime}
                        text={messageObj.content}
                      />
                    </>
                  );
                }
              })
            )}
            {newMessages.map((messageObj, index) => {
              if (messageObj.user !== user.userId) {
                const date = new Date(messageObj.dateCreated);
                // Get hours and minutes
                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, "0");

                // Convert to 12-hour format and adjust AM/PM
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12; // Hour "0" becomes "12" in 12-hour format

                // Format time without leading zero
                const formattedTime = `${hours}:${minutes} ${ampm}`;

                return (
                  <>
                    <ReceivedMessage
                      username={activeRoomUsers[0].firstName}
                      key={index}
                      time={formattedTime}
                      text={messageObj.content}
                    />
                  </>
                );
              } else {
                const date = new Date(messageObj.dateCreated);

                // Get hours and minutes
                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, "0");

                // Convert to 12-hour format and adjust AM/PM
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12; // Hour "0" becomes "12" in 12-hour format

                // Format time without leading zero
                const formattedTime = `${hours}:${minutes} ${ampm}`;
                return (
                  <>
                    <UserMessage
                      key={index}
                      time={formattedTime}
                      text={messageObj.content}
                    />
                  </>
                );
              }
            })}
          </div>
          <div className="chat-window-footer">
            <textarea
              id="message-input"
              placeholder="Type a message"
              type="text"
            />
            <button onClick={handleSendMessage} className="message-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </>
    );
  } else if (loadingRooms) {
    return (
      <>
        <section className="chat-window-container">
          <header className="chat-window-header">
            <div className="chat-room-info-container">
              <div className="loading-chat-room-info-pfp"></div>
              <div className="chat-room-info-text-container">
                <div className="loading-chat-room-info-text"></div>
              </div>
            </div>
          </header>
          <div className="loading-chat-window-scroll-container"></div>
          <div className="chat-window-footer">
            <textarea placeholder="Type a message" type="text" />
            <button className="message-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <>
        <section className="chat-window-container">
          <header className="chat-window-header">
            <div className="chat-room-info-container">
              <div className="chat-room-info-text-container"></div>
            </div>
          </header>
          <div className="loading-chat-window-scroll-container"></div>
          <div className="chat-window-footer">
            <textarea placeholder="Type a message" type="text" />
            <button className="message-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </>
    );
  }
}

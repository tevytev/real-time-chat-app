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

  const { user, family, activeTab } = useContext(UserContext);

  const [activeRoomUsers, setActiveRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [skip, setSkip] = useState(0);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);

  // Message to send states
  const [imageToSend, setImageToSend] = useState(null);
  const [messageToSend, setMessageToSend] = useState("");

  const [inputImage, setInputImage] = useState(null);

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
    // if (chatWindowRef.current) {
    //   chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    // }

    const scrollToBottom = () => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    };


    // Set a delay to allow for the render to complete
  const timeoutId = setTimeout(scrollToBottom, 10);

  return () => clearTimeout(timeoutId); // Cleanup the timeout

  }, [activeRoomUsers, activeRoomId]); // Trigger when messages change

  const handleFileChange = (e) => {
    const input = document.getElementById("file-upload");
    const file = input.files[0];
    const objectURL = URL.createObjectURL(file);

    if (file) {
      const fileType = ["image/jpeg", "image/png", "image/jpg"];

      if (fileType.includes(file.type)) {
        // setError("");
        setInputImage(objectURL);
        setImageToSend(file);
      } else {
        // setError("Error: Please upload a valid image file (JPG, JPEG, PNG)");
        setInputImage(null);
        setImageToSend(null);
      }
    }
  };

  const cancelSendImage = (e) => {
    const input = document.getElementById("file-upload");
    input.files = null;
    setInputImage(null);
    setImageToSend(null);
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageToSend) return;

    const body = {
      messageContent: messageToSend,
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
        setMessageToSend("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendImageMessage = async (e) => {
    e.preventDefault();
    if (!imageToSend) return;

    // Attach image to body
    const formData = new FormData();
    formData.append("image", imageToSend);

    try {
      
      const response = await axios.post(
        `${MESSAGE_URL}createImage/${activeRoomId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log(response)
        // created message to send to websocket
        const createdMessage = response.data.message;
        // emit message to all active room users
        socket.emit("sendMessage", activeRoomId, createdMessage);
        // clear input
        setImageToSend(null);
        setInputImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
                {activeRoomUsers[0].profilePic ? (
                  <img src={activeRoomUsers[0].profilePic} alt="" />
                ) : (
                  activeRoomUsers[0].firstName[0].toUpperCase()
                )}
              </div>
              <div className="chat-room-info-text-container">
                <h2>{activeRoomUsers[0].firstName}</h2>
                {family.members.includes(activeRoomUsers[0]._id) ? (
                  <p></p>
                ) : (
                  <p>
                    (Currently not in family){" "}
                    <i className="fa-solid fa-person-circle-xmark"></i>
                  </p>
                )}
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
                <div className="loader"></div>
              </div>
            ) : null}
            {loadingMessages ? (
              <div className="loading-chat-window-scroll-container">
                <div className="loader"></div>
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
                  let pfp = activeRoomUsers[0].profilePic;
                  let image = messageObj.image ? messageObj.image : null;
                  return (
                      <ReceivedMessage
                        username={activeRoomUsers[0].firstName}
                        key={index}
                        time={formattedTime}
                        text={messageObj.content ? messageObj.content : null}
                        pfp={pfp}
                        image={image}
                      />
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
                  let image = messageObj.image ? messageObj.image : null;
                  return (
                      <UserMessage
                        key={index}
                        time={formattedTime}
                        text={messageObj.content ? messageObj.content : null}
                        image={image}
                      />
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
                let pfp = activeRoomUsers[0].profilePic;
                let image = messageObj.image ? messageObj.image : null;
                return (
                    <ReceivedMessage
                      username={activeRoomUsers[0].firstName}
                      key={index}
                      time={formattedTime}
                      text={messageObj.content ? messageObj.content : null}
                      pfp={pfp}
                      image={image}
                    />
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
                let image = messageObj.image ? messageObj.image : null;
                return (
                    <UserMessage
                      key={index}
                      time={formattedTime}
                      text={messageObj.content ? messageObj.content : null}
                      image={image}
                    />
                );
              }
            })}
          </div>
          <form className="chat-window-footer">
            {imageToSend !== null ? (
              <>
                <div className="image-input" id="message-input">
                  <div onClick={cancelSendImage} className="image-cancel-container"><i className="fa-solid fa-xmark"></i></div>
                  <img
                    className="image-to-send"
                    src={inputImage ? inputImage : null}
                    alt=""
                  />
                </div>
              </>
            ) : (
              <textarea
                value={messageToSend}
                onChange={(e) => {
                  setMessageToSend(e.target.value);
                }}
                id="message-input"
                placeholder="Type a message"
                type="text"
              />
            )}
            <label htmlFor="file-upload" className={messageToSend ? "message-send-btn disabled-message" : "message-send-btn" } >
              <i className="fa-solid fa-image"></i>
            </label>
            <input
              disabled={messageToSend ? true : false}
              onChange={handleFileChange}
              id="file-upload"
              type="file"
            />
            <button
              type="submit"
              onClick={messageToSend ? handleSendMessage : handleSendImageMessage}
              className="message-send-btn"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
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
            <button type="submit" className="message-send-btn">
              <i className="fa-solid fa-image"></i>
            </button>
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
              <div className="chat-room-info-text-container"><h2>Choose a room!</h2></div>
            </div>
          </header>
          <div className="loading-chat-window-scroll-container"></div>
          <div className="chat-window-footer">
            <textarea placeholder="Type a message" type="text" />
            <button type="submit" className="message-send-btn">
              <i className="fa-solid fa-image"></i>
            </button>
            <button className="message-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </>
    );
  }
}

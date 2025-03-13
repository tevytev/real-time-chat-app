import { useState, useEffect } from "react";
import "./ChatList.css";
import ChatBox from "./ChatBox/ChatBox";
import ChatSearch from "../ChatSearch/ChatSearch";

export default function ChatList(props) {
  const { activeRoomId, setActiveRoomId, rooms, setRooms, loadingRooms, user, fetchRooms } = props;
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms.filter(room => 
    room.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {

  
    return () => {

    }
  }, [searchTerm])
  
  if (loadingRooms) {
    return (
      <>
        <section className="chat-list-container">
          <ChatSearch />
          <ul>
            <ChatBox />
            <ChatBox />
            <ChatBox />
            <ChatBox />
            <ChatBox />
            <ChatBox />
          </ul>
        </section>
      </>
    );
  } else if (searchTerm) {
    return (
      <>
        <section id="chat-list" className="chat-list-container">
          <ChatSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul className="chat-list-ul">
            {filteredRooms.length > 0 ? filteredRooms.map((room, index) => {
              // filter users id out of "members" array
              const filteredRoom = room.members.filter(member => { return member !== user.userId });
              const time = room.updatedAt;
              return (
                  <ChatBox
                    rooms={rooms}
                    upadtedAt={time}
                    key={`${room._id}-chat-list-item-${index}`}
                    roomId={room._id}
                    filteredRoom={filteredRoom}
                    activeRoomId={activeRoomId}
                    setActiveRoomId={setActiveRoomId}
                    user={user}
                    searchTerm={searchTerm}
                  />
              );
            }) : <p className="no-chat-text">No search results found</p>}
          </ul>
        </section>
      </>
    );
  } else {
    return (
      <>
        <section id="chat-list" className="chat-list-container">
          <ChatSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul className="chat-list-ul">
            {rooms.length > 0 ? rooms.map((room, index) => {
              // filter users id out of "members" array
              const filteredRoom = room.members.filter(member => { return member !== user.userId });
              const time = room.updatedAt;
              return (
                  <ChatBox
                    rooms={rooms}
                    upadtedAt={time}
                    key={`${room._id}-chat-list-item-${index}`}
                    roomId={room._id}
                    filteredRoom={filteredRoom}
                    activeRoomId={activeRoomId}
                    setActiveRoomId={setActiveRoomId}
                    user={user}
                  />
              );
            }) : <p className="no-chat-text">No chat history, you need family members!</p>}
          </ul>
        </section>
      </>
    );
  }
}

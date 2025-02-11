import { useState, useEffect } from "react";
import "./ChatList.css";
import ChatBox from "./ChatBox/ChatBox";
import ChatSearch from "../ChatSearch/ChatSearch";

export default function ChatList(props) {
  const { activeRoomId, setActiveRoomId, rooms, loadingRooms, user, fetchRooms } = props;

  useEffect(() => {
  
    return () => {
      
    }
  }, [rooms])
  

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
  } else {
    return (
      <>
        <section className="chat-list-container">
          <ChatSearch />
          <ul>
            {rooms.length > 0 ? rooms.map((room, index) => {
              // filter users id out of "members" array
              const filteredRoom = room.members.filter(member => { return member !== user.userId });
              const time = room.updatedAt;
              return (
                <>
                  <ChatBox
                    rooms={rooms}
                    upadtedAt={time}
                    key={index}
                    roomId={room._id}
                    filteredRoom={filteredRoom}
                    activeRoomId={activeRoomId}
                    setActiveRoomId={setActiveRoomId}
                    user={user}
                  />
                </>
              );
            }) : <p className="no-chat-text">No chat history, you need family members!</p>}
          </ul>
        </section>
      </>
    );
  }
}

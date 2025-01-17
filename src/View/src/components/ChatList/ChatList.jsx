import "./ChatList.css";
import ChatBox from "./ChatBox/ChatBox";
import ChatSearch from "../ChatSearch/ChatSearch";

export default function ChatList(props) {
  const { activeRoomId, setActiveRoomId, rooms, loadingRooms, user } = props;

  if (!rooms.length) {
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
            {rooms.map((room, index) => {
              // filter out users id out of "members" array
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
            })}
          </ul>
        </section>
      </>
    );
  }
}

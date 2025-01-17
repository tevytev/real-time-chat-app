import "./ReceivedMessage.css";

export default function ReceivedMessage(props) {

  const { text, time, username } = props;
  return (
    <>
      <div className="message-container">
        <div className="message-pfp">
            {username[0].toUpperCase()}
        </div>
        <div className="recieved-message-body">
          <p>
            {text}
          </p>
          <p className="message-timestamp">{time}</p>
        </div>
      </div>
    </>
  );
}

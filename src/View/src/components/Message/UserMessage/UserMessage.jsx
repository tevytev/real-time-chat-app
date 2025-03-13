import "./UserMessage.css";

export default function UserMessage(props) {
  const { text, time, image } = props;

  return (
    <>
      <div className={image ? "user-image-message-body" : "user-message-body"}>
        {image ? (
          <img className="received-message-image" src={image}></img>
        ) : (
          <p>{text}</p>
        )}
        <p className="user-message-timestamp">{time}</p>
      </div>
    </>
  );
}

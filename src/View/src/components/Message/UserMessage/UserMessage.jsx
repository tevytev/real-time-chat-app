import "./UserMessage.css";

export default function UserMessage(props) {

    const { text, time } = props;

  return (
    <>
      <div className="user-message-body">
        <p>
          {text}
        </p>
        <p className="user-message-timestamp">{time}</p>
      </div>
    </>
  );
}

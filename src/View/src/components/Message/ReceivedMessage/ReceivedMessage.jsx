import "./ReceivedMessage.css";

export default function ReceivedMessage(props) {
  const { text, time, username, livingRoom, pfp, image } = props;
  if (livingRoom) {
    return (
      <>
        <div className="message-container">
          <div className="message-pfp">{pfp ? <img src={pfp} alt="" /> : username ? username[0].toUpperCase() : null}</div>
          <div className="recieved-message-body-container">
            <p className="group-message-name">{username}</p>
            <div className="recieved-livingRoom-message-body">
              {image ? <img className="message-image" src={image}></img> : <p>{text}</p>}
              <p className="message-timestamp">{time}</p>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="message-container">
          <div className="message-pfp">{pfp ? <img src={pfp} alt="" /> : username[0].toUpperCase()}</div>
          <div className={image ? "recieved-image-message-body" : "recieved-message-body"}>
            {image ? <img className="message-image" src={image}></img> : <p>{text}</p>}
            <p className="message-timestamp">{time}</p>
          </div>
        </div>
      </>
    );
  }
}

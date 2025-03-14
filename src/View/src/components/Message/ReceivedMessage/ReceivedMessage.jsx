import "./ReceivedMessage.css";

export default function ReceivedMessage(props) {
  const { text, time, username, livingRoom, pfp, image } = props;
  if (livingRoom) {
    return (
      <>
        <div className="message-container">
          <div className="message-pfp">{pfp ? <img src={pfp} alt="" /> : username ? username[0].toUpperCase() : null}</div>
          <div className="received-message-body-container">
            <p className="group-message-name">{username}</p>
            <div className={image ? "received-image-message-body" : "received-livingRoom-message-body"}>
              {image ? <img className="received-message-image" src={image}></img> : <p>{text}</p>}
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
          <div className={image ? "received-image-message-body" : "received-message-body"}>
            {image ? <img className="received-message-image" src={image}></img> : <p>{text}</p>}
            <p className="message-timestamp">{time}</p>
          </div>
        </div>
      </>
    );
  }
}

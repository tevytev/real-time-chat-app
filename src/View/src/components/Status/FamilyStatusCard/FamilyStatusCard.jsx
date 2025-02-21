import { useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import "./FamilyStatusCard.css";

export default function FamilyStatusCard(props) {

  const { family } = useContext(UserContext);

    const { mood, feelings, availability, thoughts, firstName, userId, roomId, setActiveTab, setActiveRoomId, profilePic } = props;

    const handleSendMessage = () => {
      setActiveRoomId(roomId);
      setActiveTab("inbox");
    }

    return (
        <>
        <div className="status-container">
          <div className="status-top-container">
            <div className={profilePic ? "status-pfp" : "default-status-pfp"}>{profilePic ? <img src={profilePic} alt="user-profile-pic" /> : firstName[0]}</div>
            <div className="status-name-container">
              <p>{firstName}</p>
              {userId === family.creator ? <div className="status-creator-accent-container">
                <i class="fa-solid fa-star"></i>
              </div> : <></>}
            </div>
          </div>
          <div className="status-bottom-container">
            <div className="mood-bar-emotes-container">
              <p>Mood Meter</p>
            </div>
            <div class="radio-input">
                <label>
                  <input
                    value="value-1"
                    name={`${firstName}-radio`}
                    id="value-1"
                    type="radio"
                    checked={mood === 1 ? true : false}
                    disabled
                  />
                  <span><i class="fa-regular fa-face-frown"></i></span>
                </label>
                <label>
                  <input
                    value="value-2"
                    name={`${firstName}-radio`}
                    id="value-2"
                    type="radio"
                    checked={mood === 2 ? true : false}
                    disabled
                  />
                  <span><i class="fa-regular fa-face-frown-open"></i></span>
                </label>
                <label>
                  <input
                    value="value-3"
                    name={`${firstName}-radio`}
                    id="value-3"
                    type="radio"
                    checked={mood === 3 ? true : false}
                    disabled
                  />
                  <span><i class="fa-regular fa-face-meh"></i></span>
                </label>
                <label>
                  <input
                    value="value-4"
                    name={`${firstName}-radio`}
                    id="value-4"
                    type="radio"
                    checked={mood === 4 ? true : false}
                    disabled
                  />
                  <span><i class="fa-regular fa-face-smile"></i></span>
                </label>
                <label>
                  <input
                    value="value-5"
                    name={`${firstName}-radio`}
                    id="value-5"
                    type="radio"
                    checked={mood === 5 ? true : false}
                    disabled
                  />
                  <span><i class="fa-regular fa-face-laugh-beam"></i></span>
                </label>
                <span class="selection"></span>
              </div>
            <div className="feelings-container">
                <div className="feelings-line-container">
                  <p>{firstName} is feeling:</p><div>{feelings}</div> 
                </div>
                <div className="feelings-line-container">
                  <p>Availability: </p><div>{availability}</div> 
                </div>
            </div>
            <div className="status-message-outer-container">
                <h1>What's on {firstName}'s mind:</h1>
              <div className="status-message-container">
                <p>
                  {thoughts}
                </p>
              </div>
            </div>
            <button onClick={handleSendMessage} className="status-send-msg-btn">Send Message</button>
          </div>
        </div>
        </>
    )
}
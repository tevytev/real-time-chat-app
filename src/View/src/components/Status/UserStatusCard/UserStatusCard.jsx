import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import "./UserStatusCard.css";
import axios from "../../../api/axios";
const USER_STATUS_URL = "/api/user/"

export default function UserStatusCard(props) {

  const { creator } = useContext(UserContext);

  const { user, mood, setMood, feelings, setFeelings, availability, setAvailability, thoughts, setThoughts, edit, setEdit } = props;

  const [editMood, setEditMood] = useState(mood);
  const [editFeelings, setEditFeelings] = useState(feelings);
  const [editAvailability, setEditAvailability] = useState(availability);
  const [editThoughts, setEditThoughts] = useState(thoughts);

  useEffect(() => {
    setEditMood(mood);
    setEditFeelings(feelings);
    setEditAvailability(availability);
    setEditThoughts(thoughts);
  }, [mood, feelings, availability, thoughts])

  const handleUpdateStatus = async (e) => {
    if (!edit) return;

    const body = {
      mood: editMood,
      feelings: editFeelings,
      availability: editAvailability,
      thoughts: editThoughts
    }

    try {
      const response = await axios.post(`${USER_STATUS_URL}/${user.userId}/status`, JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const statusData = response.data;
        setMood(statusData.mood);
        setFeelings(statusData.feelings);
        setAvailability(statusData.availability);
        setThoughts(statusData.thoughts);
        setEdit(false);
      }
    } catch (error) {
      if (!error?.response) {
        console.log("No server response");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("family");
        navigate("/register");
      }
    }
  }

  // Handle cancel changes, clear edit states
  const handleCancelChanges = (e) => {
    setEdit(false);
    setEditMood(mood);
    setEditFeelings(feelings);
    setEditAvailability(availability);
    setEditThoughts(thoughts);
  }

  // Handle feelings change 
  const handleFeelingsChange = (e) => {
    setEditFeelings(e.target.value)
  }
  // Handle availability change
  const handleAvailabilityChange = (e) => {
    setEditAvailability(e.target.value);
  }

  const handleThoughtsChange = (e) => {
    setEditThoughts(e.target.value);
  }

  return (
    <>
      <div className="user-status-body-container">
        <div className="user-status-card-container">
          <div className="user-status-top-container">
            <div className={user.profilePic ? "status-pfp" : "default-status-pfp"}>{user.profilePic ? <img src={user.profilePic} alt="user-profile-pic" /> : user.firstName.slice(0,1)}</div>
            <div className="user-status-name-container">
              <p>{user.firstName}</p>
              {creator ? <div className="status-creator-accent-container">
                <i className="fa-solid fa-star"></i>
              </div> : <></>}
            </div>
          </div>
          <div className="user-status-bottom-container">
            <div className="mood-bar-emotes-container">
              <p>Mood Meter</p>
            </div>
            <div className="user-mood-radio-input">
              <label
              style={{cursor: edit ? "pointer" : "default"}}
              >
                <input
                  value="user-value-1"
                  name="user-value-radio"
                  id="user-value-1"
                  type="radio"
                  checked={edit ? null : mood === 1 ? true : false}
                  disabled={edit ? false : true}
                  style={{cursor: edit ? "pointer" : "default"}}
                  onClick={(e) => {
                    setEditMood(1)
                  }}
                />
                <span>
                  <i className="fa-regular fa-face-frown"></i>
                </span>
              </label>
              <label
              style={{cursor: edit ? "pointer" : "default"}}
              >
                <input
                  value="user-value-2"
                  name="user-value-radio"
                  id="user-value-2"
                  type="radio"
                  checked={edit ? null : mood === 2 ? true : false}
                  disabled={edit ? false : true}
                  onClick={(e) => {
                    setEditMood(2)
                  }}
                />
                <span>
                  <i className="fa-regular fa-face-frown-open"></i>
                </span>
              </label>
              <label
              style={{cursor: edit ? "pointer" : "default"}}
              >
                <input
                  value="user-value-3"
                  name="user-value-radio"
                  id="user-value-3"
                  type="radio"
                  checked={edit ? null : mood === 3 ? true : false}
                  disabled={edit ? false : true}
                  onClick={(e) => {
                    setEditMood(3)
                  }}
                />
                <span>
                  <i className="fa-regular fa-face-meh"></i>
                </span>
              </label>
              <label
              style={{cursor: edit ? "pointer" : "default"}}
              >
                <input
                  value="user-value-4"
                  name="user-value-radio"
                  id="user-value-4"
                  type="radio"
                  checked={edit ? null : mood === 4 ? true : false}
                  disabled={edit ? false : true}
                  onClick={(e) => {
                    setEditMood(4)
                  }}
                />
                <span>
                  <i className="fa-regular fa-face-smile"></i>
                </span>
              </label>
              <label
              style={{cursor: edit ? "pointer" : "default"}}
              >
                <input
                  value="user-value-5"
                  name="user-value-radio"
                  id="user-value-5"
                  type="radio"
                  checked={edit ? null : mood === 5 ? true : false}
                  disabled={edit ? false : true}
                  onClick={(e) => {
                    setEditMood(5)
                  }}
                />
                <span>
                  <i className="fa-regular fa-face-laugh-beam"></i>
                </span>
              </label>
              <span className="user-selection"></span>
            </div>
            <div className="feelings-container">
              <div className="feelings-line-container">
                <label htmlFor="pet-select">You are feeling:</label>
                {edit ? <div className="status-dropdwn-container"><select onChange={handleFeelingsChange} className="status-select" id="feeings-status-select" name="feelings">
                  <option selected={ feelings === "" ? true : false} value="">How are you feeling?</option>
                  <option selected={ feelings === "Happy" ? true : false} value="Happy">Happy</option>
                  <option selected={ feelings === "Sad" ? true : false} value="Sad">Sad</option>
                  <option selected={ feelings === "Excited" ? true : false} value="Excited">Excited</option>
                  <option selected={ feelings === "Angry" ? true : false} value="Angry">Angry</option>
                  <option selected={ feelings === "Proud" ? true : false} value="Proud">Proud</option>
                  <option selected={ feelings === "Anxious" ? true : false} value="Anxious">Anxious</option>
                  <option selected={ feelings === "Stressed" ? true : false} value="Stressed">Stressed</option>
                  <option selected={ feelings === "Content" ? true : false} value="Content">Content</option>
                  <option selected={ feelings === "Bored" ? true : false} value="Bored">Bored</option>
                  <option selected={ feelings === "Grateful" ? true : false} value="Grateful">Grateful</option>
                  <option selected={ feelings === "Disappointed" ? true : false} value="Disappointed">Disappointed</option>
                  <option selected={ feelings === "Inspired" ? true : false} value="Inspired">Inspired</option>
                  <option selected={ feelings === "Overwhelmed" ? true : false} value="Overwhelmed">Overwhelmed</option>
                  <option selected={ feelings === "Relaxed" ? true : false} value="Relaxed">Relaxed</option>
                  <option selected={ feelings === "Frustrated" ? true : false} value="Frustrated">Frustrated</option>
                  <option selected={ feelings === "Hopeful" ? true : false} value="Hopeful">Hopeful</option>
                  <option selected={ feelings === "Lonely" ? true : false} value="Lonely">Lonely</option>
                  </select>
                  <i className="fa-solid fa-angle-down"></i>
                  </div>   : <><div>{feelings ? feelings : "Share how you're feeling"}</div></>}
              </div>
              <div className="feelings-line-container">
                <label>Availability: </label>
                {edit ? <div className="status-dropdwn-container"><select onChange={handleAvailabilityChange} className="status-select" name="availability" id="status-select">
                  <option selected={ availability === "" ? true : false} value="">Are you available?</option>
                  <option selected={ availability === "Busy" ? true : false} value="Busy">Busy</option>
                  <option selected={ availability === "Can take a call" ? true : false} value="Can take a call">Can take a call</option>
                  <option selected={ availability === "Can hang out" ? true : false} value="Can hang out">Can hang out</option>
                  <option selected={ availability === "Can text" ? true : false} value="Can text">Can text</option>
                </select><i className="fa-solid fa-angle-down"></i></div> : <><div>{availability ? availability : "Share your availability"}</div></>}
              </div>
            </div>
            <div className="status-message-outer-container">
              <h1>What's on your mind:</h1>
              <div className="user-status-message-container">
                {edit ? <textarea onChange={handleThoughtsChange} placeholder="Write a thought you would like to share" name="" id=""></textarea> : <p>
                  {thoughts ? thoughts : "Share a thought"}
                </p>}
              </div>
            </div>
            {edit ? <><button onClick={handleUpdateStatus} className="status-btn">Save Changes</button><button onClick={handleCancelChanges}  className="status-btn">Discard Changes</button></> : <><button onClick={(e) => { setEdit(true) }} className="status-btn">Edit Status</button></>}
          </div>
        </div>
      </div>
    </>
  );
}

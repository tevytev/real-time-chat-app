import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import HeaderFamilyIcon from "./HeaderFamilyIcon/HeaderFamilyIcon";
import HeaderOptions from "./HeaderOptions/HeaderOptions";
import { UserContext } from "../../routes/userContext/UserContext";

export default function Header(props) {
  const navigate = useNavigate();

  const {
    user,
    setUser,
    rooms,
    setRooms,
    family,
    setFamily,
    activeTab,
    setActiveTab,
    creator
  } = useContext(UserContext);

  const [collapsed, setCollapsed] = useState(false);
  const [pfp, setPfp] = useState();

  useEffect(() => {
    if (user.profilePic) {
      setPfp(user.profilePic);
    } else {
      setPfp(null);
    }
  }, [user]);

  if (activeTab === "inbox") {
    return (
      <>
        <header className="header-container">
          <div className="header-family-status-container">
            <HeaderFamilyIcon
              tabType={"inbox"}
              active={true}
              icon={<i class="fa-solid fa-comment-dots"></i>}
            />
            <HeaderFamilyIcon
              tabType={"familyChat"}
              icon={<i class="fa-solid fa-people-roof"></i>}
            />
            <HeaderFamilyIcon
              tabType={"status"}
              icon={<i class="fa-solid fa-face-smile"></i>}
            />
            <HeaderFamilyIcon
              tabType={"settings"}
              icon={<i className="fa-solid fa-gear"></i>}
            />
            <h1>Rooms</h1>
          </div>
          <div className="header-user-status-container">
            <div
              className={pfp ? "header-user-pfp" : "default-header-user-pfp"}
            >
              {pfp ? (
                <img src={pfp} alt="user-profile-pic" />
              ) : user.firstName ? (
                user.firstName[0].toUpperCase()
              ) : null}
            </div>
            <div className="header-user-info">
              <div className="header-family-name-container">
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                {creator ?<div className="creator-accent-container">
                  <i class="fa-solid fa-star"></i>
                </div> : <></> }
              </div>
              <p>{family.familyName} family</p>
              <HeaderOptions />
            </div>
          </div>
        </header>
      </>
    );
  } else if (activeTab === "status") {
    return (
      <>
        <header className="header-container">
          <div className="header-family-status-container">
            <HeaderFamilyIcon
              tabType={"inbox"}
              icon={<i class="fa-solid fa-comment-dots"></i>}
            />
            <HeaderFamilyIcon
              tabType={"familyChat"}
              icon={<i class="fa-solid fa-people-roof"></i>}
            />
            <HeaderFamilyIcon
              tabType={"status"}
              active={true}
              icon={<i class="fa-solid fa-face-smile"></i>}
            />
            <HeaderFamilyIcon
              tabType={"settings"}
              icon={<i className="fa-solid fa-gear"></i>}
            />
            <h1>Family Status</h1>
          </div>
          <div className="header-user-status-container">
            <div
              className={pfp ? "header-user-pfp" : "default-header-user-pfp"}
            >
              {pfp ? (
                <img src={pfp} alt="user-profile-pic" />
              ) : user.firstName ? (
                user.firstName[0].toUpperCase()
              ) : null}
            </div>
            <div className="header-user-info">
              <div className="header-family-name-container">
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                {creator ?<div className="creator-accent-container">
                  <i class="fa-solid fa-star"></i>
                </div> : <></> }
              </div>
              <p>{family.familyName} family</p>
              <HeaderOptions />
            </div>
          </div>
        </header>
      </>
    );
  } else if (activeTab === "familyChat") {
    return (
      <>
        <header className="header-container">
          <div className="header-family-status-container">
            <HeaderFamilyIcon
              tabType={"inbox"}
              icon={<i class="fa-solid fa-comment-dots"></i>}
            />
            <HeaderFamilyIcon
              tabType={"familyChat"}
              active={true}
              icon={<i class="fa-solid fa-people-roof"></i>}
            />
            <HeaderFamilyIcon
              tabType={"status"}
              icon={<i class="fa-solid fa-face-smile"></i>}
            />
            <HeaderFamilyIcon
              tabType={"settings"}
              icon={<i className="fa-solid fa-gear"></i>}
            />
            <h1>The Living Room</h1>
          </div>
          <div className="header-user-status-container">
            <div
              className={pfp ? "header-user-pfp" : "default-header-user-pfp"}
            >
              {pfp ? (
                <img src={pfp} alt="user-profile-pic" />
              ) : user.firstName ? (
                user.firstName[0].toUpperCase()
              ) : null}
            </div>
            <div className="header-user-info">
              <div className="header-family-name-container">
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                {creator ?<div className="creator-accent-container">
                  <i class="fa-solid fa-star"></i>
                </div> : <></> }
              </div>
              <p>{family.familyName} family</p>
              <HeaderOptions />
            </div>
          </div>
        </header>
      </>
    );
  } else if (activeTab === "settings") {
    return (
      <>
        <header className="header-container">
          <div className="header-family-status-container">
            <HeaderFamilyIcon
              tabType={"inbox"}
              icon={<i class="fa-solid fa-comment-dots"></i>}
            />
            <HeaderFamilyIcon
              tabType={"familyChat"}
              icon={<i class="fa-solid fa-people-roof"></i>}
            />
            <HeaderFamilyIcon
              tabType={"status"}
              icon={<i class="fa-solid fa-face-smile"></i>}
            />
            <HeaderFamilyIcon
              tabType={"settings"}
              active={true}
              icon={<i className="fa-solid fa-gear"></i>}
            />
            <h1>Settings</h1>
          </div>
          <div className="header-user-status-container">
            <div
              className={pfp ? "header-user-pfp" : "default-header-user-pfp"}
            >
              {pfp ? (
                <img src={pfp} alt="user-profile-pic" />
              ) : user.firstName ? (
                user.firstName[0].toUpperCase()
              ) : null}
            </div>
            <div className="header-user-info">
              <div className="header-family-name-container">
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                {creator ?<div className="creator-accent-container">
                  <i class="fa-solid fa-star"></i>
                </div> : <></> }
              </div>
              <p>{family.familyName} family</p>
              <HeaderOptions />
            </div>
          </div>
        </header>
      </>
    );
  }
}

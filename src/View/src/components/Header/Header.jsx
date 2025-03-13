import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import HeaderFamilyIcon from "./HeaderFamilyIcon/HeaderFamilyIcon";
import HeaderOptions from "./HeaderOptions/HeaderOptions";
import { UserContext } from "../../routes/userContext/UserContext";
const LOGOUT_URL = "/api/auth/logout";
import axios from "../../api/axios";

export default function Header(props) {

  const { handleToggleChats } = props;

  const navigate = useNavigate();

  const { user, family, activeTab, creator } = useContext(UserContext);

  const [pfp, setPfp] = useState();

  useEffect(() => {
    if (user.profilePic) {
      setPfp(user.profilePic);
    } else {
      setPfp(null);
    }
  }, [user]);

  const handleLogoutClick = (e) => {
    const creatorWindow = document.getElementById(`logout-window`);

    if (creatorWindow.style.display === "")
      creatorWindow.style.display = "flex";
    else creatorWindow.style.display = "";
  };

  const handleLogout = async (e) => {
    try {
      const response = await axios.post(LOGOUT_URL, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.removeItem("user");
        localStorage.removeItem("family");
        navigate("/register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header id="dash-header" className="header-container">
        <nav id="nav" className="header-family-status-container">
          <ul className="header-family-status-list-container">
            <HeaderFamilyIcon
              tabType={"inbox"}
              active={activeTab === "inbox" ? true : false}
              icon={<i className="fa-solid fa-door-open"></i>}
            />
            <HeaderFamilyIcon
              tabType={"familyChat"}
              icon={<i className="fa-solid fa-couch"></i>}
              active={activeTab === "familyChat" ? true : false}
            />
            <HeaderFamilyIcon
              tabType={"status"}
              icon={<i className="fa-solid fa-face-smile"></i>}
              active={activeTab === "status" ? true : false}
            />
            <HeaderFamilyIcon
              tabType={"settings"}
              icon={<i className="fa-solid fa-gear"></i>}
              active={activeTab === "settings" ? true : false}
            />
          </ul>
          <h1>
            {activeTab === "inbox"
              ? "Rooms"
              : activeTab === "familyChat"
              ? "Living Room"
              : activeTab === "status"
              ? "Family Status"
              : activeTab === "settings"
              ? "Settings"
              : null}
          </h1>
        </nav>
        <div id="header-user" className="header-user-status-container">
          <div className="contact-burger-btn-container">
            <div onClick={handleToggleChats} className="contact-burger-btn">
              <label className="buttons__burger" htmlFor="burger">
                <input disabled type="checkbox" id="burger" />
                <span></span>
                <span></span>
                <span></span>
              </label>
            </div>
          </div>
          <div className={pfp ? "header-user-pfp" : "default-header-user-pfp"}>
            {pfp ? (
              <img src={pfp} alt="user-profile-pic" />
            ) : user.firstName ? (
              user.firstName[0].toUpperCase()
            ) : null}
          </div>
          <div className="header-user-info">
            <div className="header-family-name-container">
              <h1>{`${user.firstName} ${user.lastName}`}</h1>
              {creator ? (
                <div className="creator-accent-container">
                  <i className="fa-solid fa-star"></i>
                </div>
              ) : (
                <></>
              )}
            </div>
            <p>{family.familyName} family</p>
            <button onClick={handleLogoutClick} className="header-logout-btn">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
          <HeaderOptions />
        </div>
        <div id={`logout-window`} className="sure-message-backdrop">
          <div className="sure-container">
            <p>
              Are you sure you want to <strong>Logout</strong>
            </p>
            <div className="sure-btn-container">
              <button onClick={handleLogout}>Yes, logout</button>
              <button onClick={handleLogoutClick}>Cancel</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

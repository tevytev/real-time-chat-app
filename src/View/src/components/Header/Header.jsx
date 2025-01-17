import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import HeaderFamilyIcon from "../HeaderFamilyIcon/HeaderFamilyIcon";
const LOGOUT_URL = "/api/auth/logout";
import axios from "../../api/axios";

export default function Header(props) {

  const navigate = useNavigate();

  const { activeStatus, setActiveStatus, user } = props;

  const [collapsed, setCollapsed] = useState(false);

  // Logout function
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
        navigate("/register");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <header className="header-container">
        <div className="header-family-status-container">
          <HeaderFamilyIcon active={true} icon={<i class="fa-solid fa-comment-dots"></i>} />
          <HeaderFamilyIcon icon={<i class="fa-solid fa-people-roof"></i>} />
          <HeaderFamilyIcon icon={<i class="fa-solid fa-face-smile"></i>} />
          <HeaderFamilyIcon icon={<i class="fa-regular fa-calendar"></i>} />
          <HeaderFamilyIcon icon={<i class="fa-solid fa-bell"></i>} />
        </div>
        <div className="header-user-status-container">
          <div className="header-user-pfp">T</div>
          <div className="header-user-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <div onClick={handleLogout} id="user-options">
              <i className="fa-solid fa-ellipsis"></i>
            </div>
            <div id="user-settings">
              <i className="fa-solid fa-gear"></i>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

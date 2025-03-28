import { useNavigate } from "react-router-dom";
import "./HeaderOptionsDropdown.css";
import axios from "../../../api/axios";
const LOGOUT_URL = "/api/auth/logout";


export default function HeaderOptionsDropdown() {

  const navigate = useNavigate();

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
        localStorage.removeItem("family");
        navigate("/register");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className="header-options-container">
        <ul>
            <li onClick={handleLogout} className="option">Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></li>
        </ul>
      </div>
    </>
  );
}

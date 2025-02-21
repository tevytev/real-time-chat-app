import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../routes/userContext/UserContext";
import FamilyMemberListItem from "./FamilyMemberListItem/FamilyMemberListItem";
import "./FamilyInfoSettings.css";
const LOGOUT_URL = "/api/auth/logout";
const FAMILY_URL = "/api/family/";
import axios from "../../../api/axios";

export default function FamilyInfoSettings(props) {

  const { family, creator } = useContext(UserContext);

  // References to user info and password inputs
  const familyNameRef = useRef();

  // Family info states
  const [edit, setEdit] = useState(false);
  const [members, setMembers] = useState([]);

  //  Navigation function
  const navigate = useNavigate();

  // Look up family members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${FAMILY_URL}${family.familyId}/members`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const membersData = response.data;
          setMembers(membersData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {

    if (edit) familyNameRef.current.focus();
    
  }, [edit]);

  const handleCopyAccessCode = (e) => {
    e.preventDefault();

    const copyText = document.getElementById("access-code");

    navigator.clipboard
      .writeText(copyText.textContent)
      .then(() => {
        alert("Access code copied!");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  const handleMemberExpand = (e) => {
    const dropDown = document.getElementById("test");
    const btn = document.getElementById("member-show-more");

    if (dropDown.style.maxHeight)
      (dropDown.style.maxHeight = null),
        (dropDown.style.marginTop = null),
        (btn.innerHTML =
          '<p>Show more</p><i class="fa-solid fa-angle-down"></i>');
    else
      (dropDown.style.maxHeight = "150px"),
        (dropDown.style.marginTop = "1rem"),
        (btn.innerHTML =
          '<p>Show less</p><i class="fa-solid fa-angle-up"></i>');
  };

  // Logout for logout button
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

  // Leave family function for leave family button
  const handleLeaveFamilyWindow = async () => {
    const removeWindow = document.getElementById("leave-window");

    if (removeWindow.style.display === "") removeWindow.style.display = "flex";
    else {
      removeWindow.style.display = "";
      return;
    }
  };

  const handleLeaveFamily = async () => {

    const body = {
      familyId: family.familyId
    };

    try {
      const response = await axios.post(
        `${FAMILY_URL}leave`, 
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("family");
        navigate("/familysetup");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {edit ? (
        <div className="setting-sector-container">
          <h3>Family Information</h3>
          <form action="">
            <div className="setting-input-container">
              <label htmlFor="">Family name</label>
              <input ref={familyNameRef} type="text" placeholder={family.familyName} />
            </div>
            <div className="setting-input-container">
              <label htmlFor="">Access code</label>
              <div
                onMouseEnter={(e) => {
                  const clipboard = document.getElementById("clipboard");
                  clipboard.style.opacity = 100;
                }}
                onMouseLeave={(e) => {
                  const clipboard = document.getElementById("clipboard");
                  clipboard.style.opacity = 0;
                }}
                className="setting-field"
              >
                <p id="access-code">{family.familyAccessCode}</p>
                <div id="clipboard" className="clipboard-container">
                  <i class="fa-solid fa-arrows-rotate"></i>
                </div>
              </div>{" "}
            </div>
            <div className="family-btn-container">
              <button className="setting-btn">Save Changes</button>
              <button
                onClick={(e) => {
                  setEdit(false);
                }}
                className="setting-btn"
              >
                Cancel
              </button>
              <button className="leave-family-btn">Leave Family</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="setting-sector-container">
          <h3>Family Information</h3>
          <div className="setting-field-container">
            <div className="setting-input-container">
              <label htmlFor="">Family name</label>
              <div className="setting-field">
                <p>{family.familyName}</p>
              </div>
            </div>
            <div className="setting-input-container">
              <label htmlFor="">Access code</label>
              <div
                onMouseEnter={(e) => {
                  const clipboard = document.getElementById("clipboard");
                  clipboard.style.opacity = 100;
                }}
                onMouseLeave={(e) => {
                  const clipboard = document.getElementById("clipboard");
                  clipboard.style.opacity = 0;
                }}
                className="setting-field"
              >
                <p id="access-code">{family.familyAccessCode}</p>
                <div
                  onClick={handleCopyAccessCode}
                  id="clipboard"
                  className="clipboard-container"
                >
                  <i class="fa-regular fa-clipboard"></i>
                </div>
              </div>
            </div>
            {creator ? <div className="family-btn-container">
              <button
                onClick={(e) => {
                  setEdit(true);
                }}
                className="setting-btn"
              >
                Edit
              </button>
            </div> :<></> }
            <div className="setting-input-container">
              <label htmlFor="">Members</label>
              <div className="members-down-container">
                <button
                  id="member-show-more"
                  onClick={handleMemberExpand}
                  className="setting-btn"
                >
                  Show more
                  <i class="fa-solid fa-angle-down"></i>
                </button>
                <div id="test" className="test-body">
                  <div className="inner-test">
                    <ul>
                      {members.map((memberObj) => {
                        return (
                          <>
                         <FamilyMemberListItem name={memberObj.firstName} memberId={memberObj.memberId} />
                          </>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="family-btn-container">
              <button onClick={handleLogout} className="setting-btn">
                Logout
              </button>
              <button onClick={handleLeaveFamilyWindow} className="leave-family-btn">
                Leave Family
              </button>
            </div>
          </div>
          <div id="leave-window" className="sure-message-backdrop">
            <div className="sure-container">
              <p>
                Are you sure you want to <strong>leave</strong> the{" "}
              {family.familyName} family?
              </p>
              <div className="sure-btn-container">
                <button onClick={handleLeaveFamily}>Yes</button>
                <button onClick={handleLeaveFamilyWindow}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

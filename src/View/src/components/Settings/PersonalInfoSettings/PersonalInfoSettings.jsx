import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import axios from "../../../api/axios";
import "./PersonalInfoSettings.css";
const USER_URL = "/api/user/";
const AUTH_URL = "/api/auth/";

export default function PersonalInfoSettings(props) {
  const { user, setUser } = useContext(UserContext);

  // References to user info and password inputs
  const infoRef = useRef();
  const pwdRef = useRef();

  // Form edit states
  const [changePasswordActive, setChangePasswordActive] = useState(false);
  const [updateInfoActive, setUpdateInfoActive] = useState(false);

  // Form input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Error states
  const [infoError, setInfoError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Success states
  const [sucessMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Set cursor to proper input
    if (changePasswordActive) pwdRef.current.focus();
    if (updateInfoActive) infoRef.current.focus();

    // Cleat inputs when user
    if (!updateInfoActive) setFirstName(""), setLastName(""), setEmail("");
    if (!changePasswordActive)
      setOldPassword(""),
        setNewPassword(""),
        setConfirmPassword(""),
        setPasswordError("");
  }, [changePasswordActive, updateInfoActive]);

  // Handle update user info
  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    try {
      const response = await axios.post(
        `${USER_URL}${user.userId}/edit`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const userData = {
          userId: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          profilePic: response.data.profilePic
            ? response.data.profilePic
            : null,
          familyId: response.data.family ? response.data.family : null,
        };

        // Set user state and user local storage for data persistance
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUpdateInfoActive(false);
        setSuccessMessage("New info saved successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
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
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Error: Please complete all fields");
      pwdRef.current.focus();
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Error: Passwords do not match");
      return;
    }

    const formData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await axios.post(
        `${AUTH_URL}${user.userId}/password`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setOldPassword("");
        setNewPassword("");
        setChangePasswordActive(false);
        setSuccessMessage("New password saved successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
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
  };

  const handleChangePasswordActive = () =>
    setChangePasswordActive(!changePasswordActive);

  const handleUpdateInfoActive = () => setUpdateInfoActive(!updateInfoActive);

  return (
    <>
      <div className="setting-sector-container">
        <h3>Personal Information</h3>
        <form action="">
          {/* If update info state is active render form with inputs, render normal divs otherwise */}
          {updateInfoActive ? (
            <>
              <div className="setting-input-container">
                <label htmlFor="">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  ref={infoRef}
                  disabled={updateInfoActive ? false : true}
                  type="text"
                  placeholder={user.firstName}
                />
              </div>
              <div className="setting-input-container">
                <label htmlFor="">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  disabled={updateInfoActive ? false : true}
                  type="text"
                  placeholder={user.lastName}
                />
              </div>
              <div className="setting-input-container">
                <label htmlFor="">Email</label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={updateInfoActive ? false : true}
                  type="text"
                  placeholder={user.email}
                />
              </div>
            </>
          ) : (
            <>
              <div className="setting-input-container">
                <label htmlFor="">First name</label>
                <div className="setting-field">
                  <p>{user.firstName}</p>
                </div>
              </div>
              <div className="setting-input-container">
                <label htmlFor="">Last name</label>
                <div className="setting-field">
                  <p>{user.lastName}</p>
                </div>
              </div>
              <div className="setting-input-container">
                <label htmlFor="">Email</label>
                <div className="setting-field">
                  <p>{user.email}</p>
                </div>
              </div>
            </>
          )}
          {/* If no edit states are active render edit buttons */}
          {!changePasswordActive && !updateInfoActive ? (
            <>
              <div className="personal-setting-btn-container">
                <button
                  onClick={handleUpdateInfoActive}
                  className="setting-btn"
                >
                  Update Info
                </button>
                <button
                  onClick={handleChangePasswordActive}
                  className="setting-btn"
                >
                  Change Password
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          {/* If password edit state is active, render change password inputs and save/cancel buttons */}
          {changePasswordActive ? (
            <>
              <div className="setting-input-container">
                <label htmlFor="">Old password</label>
                <input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  ref={pwdRef}
                  type="password"
                />
              </div>
              <div className="setting-input-container">
                <label htmlFor="">New password</label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                />
              </div>
              <div className="setting-input-container">
                <label htmlFor="">Confirm new password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />
              </div>

              <div className="personal-setting-btn-container">
                {passwordError ? (
                  <div className="pfp-msg-container">
                    <p>{passwordError}</p>
                  </div>
                ) : (
                  <></>
                )}
                <button onClick={handleChangePassword} className="setting-btn">
                  Save password
                </button>
                <button
                  onClick={handleChangePasswordActive}
                  className="setting-btn"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          {/* If update info state is active, render save/cancel buttons */}
          {updateInfoActive ? (
            <>
              <div className="personal-setting-btn-container">
                <button onClick={handleUpdateUserInfo} className="setting-btn">
                  Save Info
                </button>
                <button
                  onClick={handleUpdateInfoActive}
                  className="setting-btn"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          {sucessMessage ? (
            <div className="pfp-msg-container">
              <p>{sucessMessage}</p>
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  );
}

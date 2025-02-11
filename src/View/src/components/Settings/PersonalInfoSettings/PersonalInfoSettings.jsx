import { useState, useEffect, useRef } from "react";
import "./PersonalInfoSettings.css";

export default function PersonalInfoSettings(props) {
  // Form edit states
  const [changePasswordActive, setChangePasswordActive] = useState(false);
  const [updateInfoActive, setUpdateInfoActive] = useState(false);

  // Form input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Set cursor to proper input
    if (changePasswordActive) pwdRef.current.focus();
    if (updateInfoActive) infoRef.current.focus();

    // Cleat inputs when user 
    if (!updateInfoActive) setFirstName(""), setLastName(""), setEmail("");
    if (!changePasswordActive) setOldPassword(""), setNewPassword("");
  }, [changePasswordActive, updateInfoActive]);

  const handleChangePasswordActive = () =>
    setChangePasswordActive(!changePasswordActive);
  const handleUpdateInfoActive = () => setUpdateInfoActive(!updateInfoActive);

  const infoRef = useRef();
  const pwdRef = useRef();

  return (
    <>
      <div className="setting-sector-container">
        <h3>Personal Information</h3>
        <form action="">
          <label htmlFor="">First name</label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            ref={infoRef}
            disabled={updateInfoActive ? false : true}
            type="text"
            placeholder="Tevin"
          />
          <label htmlFor="">Last name</label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            disabled={updateInfoActive ? false : true}
            type="text"
            placeholder="Cheatham"
          />
          <label htmlFor="">Email</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={updateInfoActive ? false : true}
            type="text"
            placeholder="tevin@test.com"
          />
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
          {changePasswordActive ? (
            <>
              <label htmlFor="">Old password</label>
              <input ref={pwdRef} type="password" />
              <label htmlFor="">New password</label>
              <input type="password" />
              <div className="personal-setting-btn-container">
                <button className="setting-btn">Save password</button>
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
          {updateInfoActive ? (
            <>
              <div className="personal-setting-btn-container">
                <button className="setting-btn">Save Info</button>
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
        </form>
      </div>
    </>
  );
}

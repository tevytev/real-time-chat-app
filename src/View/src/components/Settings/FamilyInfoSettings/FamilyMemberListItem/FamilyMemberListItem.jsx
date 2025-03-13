import "./FamilyMemberListItem.css";
import { useState, useContext } from "react";
import { UserContext } from "../../../../routes/userContext/UserContext";
import axios from "../../../../api/axios";
const FAMILY_URL = "/api/family/";

export default function FamilyMemberListItem(props) {
  const { creator, setCreator, family, setFamily } = useContext(UserContext);
  const { name, memberId } = props;

  const handleCreatorClick = (e) => {
    const creatorWindow = document.getElementById(`${name}-creator-window`);

    if (creatorWindow.style.display === "")
      creatorWindow.style.display = "flex";
    else creatorWindow.style.display = "";
  };

  const handleRemoveClick = (e) => {
    const removeWindow = document.getElementById(`${name}-remove-window`);

    if (removeWindow.style.display === "") removeWindow.style.display = "flex";
    else removeWindow.style.display = "";
  };

  const handleRemoveFromFamily = async () => {
    const body = {
      memberId: memberId,
      familyId: family.familyId,
    };

    try {
      const response = await axios.post(
        `${FAMILY_URL}remove`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Remove member list item from document
        const listItem = document.getElementById(`${memberId}-listitem`);
        listItem.style.display = "none";

        // family data to received from server
        const familyData = {
          familyId: response.data._id,
          familyAccessCode: response.data.familyAccessCode,
          familyName: response.data.familyName,
          livingRoomId: response.data.livingRoomId,
          members: response.data.members,
          creator: response.data.creator,
        };
        // Set server data to family state and local storage for data persistence
        setFamily(familyData);
        localStorage.setItem("family", JSON.stringify(familyData));

        // Close pop up window
        handleRemoveClick();
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

  const handleChangeCreator = async () => {
    const body = {
      memberId: memberId,
    };

    try {
      const response = await axios.post(
        `${FAMILY_URL + family.familyId}/creator`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCreator(false);
        console.log(response);

        // family data to received from server
        const familyData = {
          familyId: response.data._id,
          familyAccessCode: response.data.familyAccessCode,
          familyName: response.data.familyName,
          livingRoomId: response.data.livingRoomId,
          members: response.data.members,
          creator: response.data.creator,
        };
        // Set server data to family state and local storage for data persistence
        setFamily(familyData);
        localStorage.setItem("family", JSON.stringify(familyData));
        handleCreatorClick();
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

  return (
    <>
      <li id={`${memberId}-listitem`}>
        <p>{name}</p>
        {creator ? (
          <div className="member-list-item-btn-container">
            <button onClick={handleCreatorClick}>
              <i class="fa-solid fa-star"></i>
            </button>
            <button onClick={handleRemoveClick}>
              <i class="fa-solid fa-person-circle-minus"></i>
            </button>
          </div>
        ) : (
          <></>
        )}
      </li>
      <div id={`${name}-creator-window`} className="sure-message-backdrop">
        <div className="sure-container">
          <p>
            Are you sure you want to give your <strong>creator privileges</strong> to {name}?
            <br />
            You will <strong>lose</strong> your creator privileges.
          </p>
          <div className="sure-btn-container">
            <button onClick={handleChangeCreator}>Yes</button>
            <button onClick={handleCreatorClick}>No</button>
          </div>
        </div>
      </div>
      <div id={`${name}-remove-window`} className="sure-message-backdrop">
        <div className="sure-container">
          <p>
            Are you sure you want to <strong>remove</strong> {name} from the
            family?
          </p>
          <div className="sure-btn-container">
            <button onClick={handleRemoveFromFamily}>Yes</button>
            <button onClick={handleRemoveClick}>No</button>
          </div>
        </div>
      </div>
    </>
  );
}

import "./FamilyMemberListItem.css";
import { useState, useContext } from "react";
import { UserContext } from "../../../../routes/userContext/UserContext";

export default function FamilyMemberListItem(props) {
  const { creator } = useContext(UserContext);
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

  return (
    <>
      <li>
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
            Are you sure you want to grant {name}{" "}
            <strong>creator privileges</strong>?
          </p>
          <div className="sure-btn-container">
            <button>Yes</button>
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
            <button>Yes</button>
            <button onClick={handleRemoveClick}>No</button>
          </div>
        </div>
      </div>
    </>
  );
}

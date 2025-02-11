import { useState } from "react";
import HeaderOptionsDropdown from "../HeaderOptionsDropdown/HeaderOptionsDropdown";
import "./HeaderOptions.css"

export default function HeaderOptions() {
  const [active, setActive] = useState(false);

  return (
    <>
      <div onClick={(e) => {
        setActive(!active);
      }} id="user-options">
        <i className="fa-solid fa-ellipsis"></i>
        {active ? <HeaderOptionsDropdown /> : <></>}
      </div>
    </>
  );
}

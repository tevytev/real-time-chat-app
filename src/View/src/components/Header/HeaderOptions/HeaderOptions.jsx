import { useState } from "react";
import HeaderOptionsDropdown from "../HeaderOptionsDropdown/HeaderOptionsDropdown";
import "./HeaderOptions.css"

export default function HeaderOptions() {
  const [active, setActive] = useState(false);

  return (
    <>
      <div onClick={(e) => {
        setActive(!active);
      }} id={active ? "user-options-active" : "user-options"}>
        <i class="fa-solid fa-ellipsis-vertical"></i>
        {active ? <HeaderOptionsDropdown /> : <></>}
      </div>
    </>
  );
}

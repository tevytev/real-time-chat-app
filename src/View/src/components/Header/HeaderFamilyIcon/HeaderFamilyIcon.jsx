import { useState, useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import "./HeaderFamilyIcon.css";


export default function HeaderFamilyIcon(props) {

    const { activeTab, setActiveTab } =
    useContext(UserContext);

    const { icon, active, tabType, } = props;

    if (active) {
        return (
        <>
        <li className="family-icon-container-active">
            {icon}
        </li>
        </>
    ) 
    } else {
        return (
            <>
            <li onClick={(e) => {
                setActiveTab(tabType)
            }} className="family-icon-container">
                {icon}
            </li>
            </>
        ) 
    }
   
}
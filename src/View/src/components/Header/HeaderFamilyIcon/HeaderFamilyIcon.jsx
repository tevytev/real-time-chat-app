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
        <div className="family-icon-container-active">
            {icon}
        </div>
        </>
    ) 
    } else {
        return (
            <>
            <div onClick={(e) => {
                setActiveTab(tabType)
            }} className="family-icon-container">
                {icon}
            </div>
            </>
        ) 
    }
   
}
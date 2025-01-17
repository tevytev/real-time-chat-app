import { useState } from "react";
import "./HeaderFamilyIcon.css";


export default function HeaderFamilyIcon(props) {

    const { icon, active } = props;

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
            <div className="family-icon-container">
                {icon}
            </div>
            </>
        ) 
    }
   
}
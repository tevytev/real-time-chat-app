import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import "./FamilyInfoSettings.css";



export default function FamilyInfoSettings(props) {

    const { family } =
    useContext(UserContext);

    return (
        <>
        <div className="setting-sector-container">
            <h3>Family Information</h3>
            <form action="">
                <label htmlFor="">Family name</label>
                <input disabled type="text" placeholder={family.familyName} />
                <label htmlFor="">Number of members</label>
                <input disabled type="text" placeholder={family.members.length} />
                <label htmlFor="">Access code</label>
                <input type="text" placeholder={family.familyAccessCode} />
                <button className="leave-family-btn">Leave Family</button>
            </form>
        </div>
        </>
    )
}
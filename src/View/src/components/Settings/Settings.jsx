import { useState, useEffect } from "react";
import ProfilePictureSetting from "./ProfilePictureSetting/ProfilePictureSetting";
import PersonalInfoSettings from "./PersonalInfoSettings/PersonalInfoSettings";
import FamilyInfoSettings from "./FamilyInfoSettings/FamilyInfoSettings";
import DisplayOptions from "./DisplayOptions/DisplayOptions";
import "./Settings.css";


export default function Settings() {

    
    return (
        <>
        <section className="settings-container">
        <header className="settings-header">
            <h2>Your Settings</h2>
        </header>
        <div className="settings-bottom-container">
            <ProfilePictureSetting />
            <PersonalInfoSettings />
            <FamilyInfoSettings />
            <DisplayOptions />
        </div>
        </section>
        </>
    )
}
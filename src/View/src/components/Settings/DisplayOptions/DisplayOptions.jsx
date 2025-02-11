import { useState, useEffect } from "react";
import "./DisplayOptions.css";

export default function DisplayOptions(props) {
  return (
    <>
      <div className="setting-sector-container">
        <h3>Display Options</h3>
        <label className="ui-switch">
          <input type="checkbox" />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>
      </div>
    </>
  );
}

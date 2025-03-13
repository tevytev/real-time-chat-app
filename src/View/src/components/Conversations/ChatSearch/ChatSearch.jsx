import { useEffect, useState } from "react";
import "./ChatSearch.css";


export default function ChatSearch(props) {

    const { setSearchTerm, searchTerm } = props;

    return (
        <>
        <div className="chat-search-container">
            <div className="chat-search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
            }} placeholder="Quick lookup" type="text" name="" id="" />
            {searchTerm ? <i onClick={(e) => setSearchTerm("")} className="fa-solid fa-circle-xmark clear-search"></i> : null}
            </div>
        </div>
        </>
    )
}
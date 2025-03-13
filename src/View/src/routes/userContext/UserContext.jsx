import React, { createContext, useEffect, useState } from "react";
import axios from "../../api/axios";
const FAMILY_URL = "/api/family/";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [family, setFamily] = useState({});
  const [creator, setCreator] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");

  useEffect(() => {
    // Simulating user fetch logic, replace with actual data fetching logic
    const fetchedUser = localStorage.getItem("user"); // or API request
    const fetchedFamily = localStorage.getItem("family");
    if (fetchedUser) {
      setUser(JSON.parse(fetchedUser));
      if (fetchedFamily) {
        setFamily(JSON.parse(fetchedFamily));
      } else {
        fetchFamily();
      }
    }
  }, []);

  useEffect(() => {
    const fetchedFamily = localStorage.getItem("family");
    if (fetchedFamily) {
      const familyObj = JSON.parse(fetchedFamily);
      if (familyObj.creator === user.userId) {
        setCreator(true);
      } else {
        setCreator(false);
      }
    }
  }, [user, family]);

  // Fetch family function as fallback if family data is not located in local storage
  const fetchFamily = async () => {
    try {
      const response = await axios.get(
        `${FAMILY_URL}${user.familyId}`,
        JSON.stringify(getFormData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // family data to received from server
        const familyData = {
          familyId: response.data._id,
          familyAccessCode: response.data.familyAccessCode,
          familyName: response.data.familyName,
          livingRoomId: response.data.livingRoomId,
          members: response.data.members,
          creator: response.data.creator,
        };
        // Set server data to family state and local storage for data persistence
        setFamily(familyData);
        localStorage.setItem("family", JSON.stringify(familyData));

        // if user ID matches family creator's user ID set creator state to true
        if (familyData.creator === user.userId) setCreator(true);
      }
    } catch (error) {
      if (!error?.response) {
        console.log("No server response");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("family");
        navigate("/register");
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        rooms,
        setRooms,
        family,
        setFamily,
        activeTab,
        setActiveTab,
        creator,
        setCreator,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

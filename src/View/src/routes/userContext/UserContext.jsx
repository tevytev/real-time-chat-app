import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [rooms, setRooms] = useState([]);
    const [family, setFamily] = useState({});

    useEffect(() => {
      // Simulating user fetch logic, replace with actual data fetching logic
      const fetchedUser = localStorage.getItem('user');  // or API request
      if (fetchedUser) {
        setUser(JSON.parse(fetchedUser));
      }
    }, []);
  
    return (
      <UserContext.Provider value={{ user, setUser, rooms, setRooms }}>
        {children}
      </UserContext.Provider>
    );
  };
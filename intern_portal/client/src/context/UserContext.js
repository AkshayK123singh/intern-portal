// /client/src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserState = (updatedUserData) => {
    setCurrentUser(updatedUserData);
  };

  return (
    <UserContext.Provider value={{ currentUser, fetchCurrentUser, logout, updateUserState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
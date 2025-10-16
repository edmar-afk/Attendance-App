import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const loadUserData = async () => {
    const storedData = await AsyncStorage.getItem("userData");
    if (storedData) setUserData(JSON.parse(storedData));
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

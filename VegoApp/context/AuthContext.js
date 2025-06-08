import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isFirstLaunch, setIsFirstLaunch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

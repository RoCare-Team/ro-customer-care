"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status from localStorage
  const checkLoginStatus = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const userToken = localStorage.getItem("userToken");
      const userPhone = localStorage.getItem("userPhone");
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");
      const customerId = localStorage.getItem("customer_id"); // ✅ FIXED

      const loggedIn = !!userToken;
      setIsLoggedIn(loggedIn);

      if (loggedIn && customerId) {
        setUserInfo({
          phone: userPhone,
          name: userName || "Customer",
          email: userEmail || "",
          id: customerId,
        });
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
    setIsLoading(false);
  }, []);

  // Call after successful login
  const handleLoginSuccess = useCallback((user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  }, []);

  // Logout user and clear localStorage
  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("customer_id"); // ✅ FIXED
    setIsLoggedIn(false);
    setUserInfo(null);

    
  }, []);

  // Check on mount + listen for storage changes
  useEffect(() => {
    checkLoginStatus();
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkLoginStatus]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      userInfo,
      isLoading,
      checkLoginStatus,
      handleLoginSuccess,
      logout,
    }),
    [isLoggedIn, userInfo, isLoading, checkLoginStatus, handleLoginSuccess, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

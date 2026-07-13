import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const hasSession = localStorage.getItem("isLoggedIn") === "true";
    
    if (!hasSession) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.log("No active session");
        localStorage.removeItem("isLoggedIn");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response.data);
      setUser(null);
      localStorage.removeItem("isLoggedIn");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () =>
  useContext(UserContext);
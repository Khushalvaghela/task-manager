import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
  
      socket.emit("join", userId); 
    }
  
    fetchNotifications();
  
    socket.on("newNotification", (notif) => {
      console.log("🔔 Received new notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
    });
  
    return () => {
      socket.off("newNotification");
    };
  }, []);
  

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

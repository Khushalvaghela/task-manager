
import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";
import { useNotifications } from "../contax/NotificationContext";
import socket from "../socket";
export default function Dashboard() {
  const [reload, setReload] = useState(false);
  const { setNotifications } = useNotifications();
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };
  
  useEffect(() => {
    fetchNotifications();
    socket.on("newTask", fetchNotifications);
    socket.on("taskCompleted", fetchNotifications);
    socket.on("taskDeleted", fetchNotifications);

    return () => {
      socket.off("newTask", fetchNotifications);
      socket.off("taskCompleted", fetchNotifications);
      socket.off("taskDeleted", fetchNotifications);}
  }, [reload]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Task Management Dashboard
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <TaskForm onTaskCreated={() => setReload(!reload)} />
        </div>
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
          <TaskList key={reload} />
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData ? userData.role : null;
  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    navigate("/");
  };
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-2xl tracking-wide">Task Manager</h1>
        <div className="flex items-center space-x-6">
          <NotificationBell />
          <Link
            to="/register"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 !no-underline"
          >
            Register
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 !no-underline"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2 bg-emerald-300 text-white rounded-lg shadow-md hover:bg-emerald-400 transition duration-300 !no-underline"
          >
            Profile
          </Link>
          {userRole === "admin" && (
          <Link
            to="/userManagement "
            className="px-4 py-2 bg-emerald-300 text-white rounded-lg shadow-md hover:bg-emerald-400 transition duration-300 !no-underline"
          >
            userManagement
          </Link>)}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300 !no-underline"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

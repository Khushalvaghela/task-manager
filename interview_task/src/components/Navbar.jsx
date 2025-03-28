
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-2xl tracking-wide">Task Manager</h1>
        <div className="space-x-4">
          <Link
            to="/register"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-100 transition duration-300"
          >
            Register
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Dashboard
          </Link>
          <Link to="/profile" className="px-4 py-2 bg-emerald-300 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300">Profile</Link>
          <Link
            to="/"
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

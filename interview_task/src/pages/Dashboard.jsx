
import React, { useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [reload, setReload] = useState(false);

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


import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Checkbox } from "@mui/material";
import socket from "../socket";
const Profile = () => {
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignedTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/tasks/assigned", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
           
            const updatedTasks = response.data.map(task => {
                const baseDate = new Date(task.date);
                const dueDateTime = new Date(baseDate.getTime());
                dueDateTime.setMinutes(dueDateTime.getMinutes() + task.validity); 
              
                const currentDate = new Date();
              
                if (dueDateTime < currentDate) {
                  return { ...task, status: "inactive" };
                }
                return task;
              });
          
            
            setAssignedTasks(updatedTasks);
        } catch (error) {
            console.error("Error fetching assigned tasks", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id; 
      
          socket.emit("join", userId); 
        }
      
        fetchAssignedTasks();
        console.log(" Setting up newTask listener...");
      
        socket.on("newTask", (task) => {
        //   console.log(" New task assigned:", task);
          fetchAssignedTasks();
        });
      
        socket.on("taskDeleted", () => {
        //   console.log(" Task deleted");
          fetchAssignedTasks();
        });
      
        socket.on("taskCompleted", () => {  
        //   console.log(" Task completed");
          fetchAssignedTasks();
        });
      
        return () => {
          socket.off("newTask");
          socket.off("taskDeleted");
          socket.off("taskCompleted");
        };
      }, []);
      
    const toggleCompletion = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
    
          
            const updatedTasks = assignedTasks.map((task) =>
                task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            );
            setAssignedTasks(updatedTasks);
    
            
            await axios.put(
                `http://localhost:5000/api/tasks/${taskId}/completion`,
                {}, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (error) {
            console.error("Error updating task completion", error);
        }
    };
    const formatValidity = (validityInMinutes) => {
        const hours = Math.floor(validityInMinutes / 60);
        const minutes = validityInMinutes % 60;
        return `${hours}h ${minutes}m`;
    };
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">📌 Assigned Tasks</h1>

            {loading ? (
                <div className="flex justify-center">
                    <CircularProgress color="secondary" />
                </div>
            ) : assignedTasks.length === 0 ? (
                <p className="text-center text-gray-500">No assigned tasks</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {assignedTasks.map((task) => (
                        <Card key={task._id} className="shadow-lg border border-gray-200">
                            <CardContent className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                                <Typography variant="h6" className="font-bold">
                                    {task.title}
                                </Typography>
                                <Typography variant="body2" className="mt-2">
                                    {task.description}
                                </Typography>

                                <Typography variant="subtitle2" className="mt-4">
                                    🔹 Assigned By: <span className="font-semibold">{task.createdBy?.name || "Unknown"}</span>
                                </Typography>
                                <Typography variant="subtitle2">
                                    ⏳ Validity: <span className="font-semibold">{formatValidity(task.validity)} </span>
                                </Typography>
                                <Typography variant="subtitle2">
                                    📅 Due Date: <span className="font-semibold">{new Date(task.date).toDateString()}</span>
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    className={`mt-4 font-bold text-lg ${task.status === "active" ? "text-green-300" : "text-red-300"}`}
                                >
                                    🚦 Status: {task.status}
                                </Typography>

                                {/* Task Completion Checkbox */}
                                <div className="flex items-center mt-2">
                                    <Checkbox
                                        checked={task.isCompleted}
                                        onChange={() => toggleCompletion(task._id)}
                                        color="primary"
                                        disabled={task.isCompleted}
                                    />
                                    <Typography>Task Completed</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;

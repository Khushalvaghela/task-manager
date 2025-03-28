import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

const Profile = () => {
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/tasks/assigned", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAssignedTasks(response.data);
            } catch (error) {
                console.error("Error fetching assigned tasks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTasks();
    }, []);

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
                                    ⏳ Validity: <span className="font-semibold">{task.validity} Days</span>
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;

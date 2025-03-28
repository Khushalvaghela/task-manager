import React, { useState, useEffect } from "react";
import { createTask, getUsers } from "../services/taskService";
import {
  TextField,
  Button,
  Autocomplete,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [validity, setValidity] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({
      title,
      description,
      date,
      validity,
      assignedUsers: assignedUsers.map((user) => user._id),
    });

    setTitle("");
    setDescription("");
    setDate("");
    setValidity("");
    setAssignedUsers([]);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-xl rounded-lg">
      <CardContent>
        <Typography
          variant="h5"
          className="text-center font-bold text-blue-700 mb-4"
        >
          Create New Task
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="mb-4">
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              type="number"
              label="Validity (Days)"
              variant="outlined"
              fullWidth
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(user) => user.name}
              value={assignedUsers}
              onChange={(event, newValue) => setAssignedUsers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Users"
                  variant="outlined"
                />
              )}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white py-3 rounded-md shadow-md transition-all duration-300"
          >
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

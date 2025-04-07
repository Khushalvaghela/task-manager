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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { styled } from "@mui/system";
import { blue, purple } from "@mui/material/colors";

const CustomDatePicker = styled(DatePicker)({
  backgroundColor: blue[50],
  borderRadius: "8px",
  border: "1px solid #ccc",
  padding: "10px",
  width: "100%",
  "&:focus": {
    borderColor: purple[600],
  },
  ".react-datepicker__triangle": {
    borderTopColor: blue[50],
  },
});

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [validityTime, setValidityTime] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser ? currentUser.id : null;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const filteredUsers = usersData.filter(
          (user) => user._id !== currentUserId && user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [hours, minutes] = validityTime.split(":").map(Number);
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    await createTask({
      title,
      description,
      date,
      validity: totalMinutes,
      assignedUsers: assignedUsers.map((user) => user._id),
    });

    setTitle("");
    setDescription("");
    setDate(null);
    // setValidity("");
    setValidityTime("");
    setAssignedUsers([]);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };
  const today = new Date();
  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-xl rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
      <CardContent>
        <Typography
          variant="h5"
          className="text-center font-bold text-white mb-6"
        >
          Create New Task
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ borderRadius: 3 }}
            />
          </div>
          <div>
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ borderRadius: 3 }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <CustomDatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select Due Date"
              required
              minDate={new Date()}
              popperClassName="custom-datepicker-popper"
            />
          </div>

          <div>
            <TextField
              type="time"
              label="Validity Time"
              variant="outlined"
              fullWidth
              value={validityTime}
              onChange={(e) => setValidityTime(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} 
            />
          </div>

          <div>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(user) => user.name}
              value={assignedUsers}
              required
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
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white py-3 rounded-md shadow-md transition-all duration-300"
          >
            Create Task
          </Button>
        </form>
      </CardContent>
      <style>{`
        .custom-datepicker-popper {
          
          z-index: 9999 !important;
        }
      `}</style>
    </Card>
  );
}

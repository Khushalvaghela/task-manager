
import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus, deleteTask } from "../services/taskService";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { green, red, blue, orange } from "@mui/material/colors";
import socket from "../socket";
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });

  useEffect(() => {
    loadTasks();
    socket.on("newTask", loadTasks);
    socket.on("taskDeleted", loadTasks);
    socket.on("taskCompleted", loadTasks);

    return () => {
      socket.off("taskCreated", loadTasks);
      socket.off("taskDeleted", loadTasks);
      socket.off("taskCompleted", loadTasks);
    };
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      showSnackbar("Error loading tasks!", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(deleteDialog.taskId);
      showSnackbar("Task deleted successfully!", "success");
      loadTasks();
    } catch (error) {
      showSnackbar("Error deleting task!", "error");
    }
    setDeleteDialog({ open: false, taskId: null });
  };

  const toggleStatus = async (taskId) => {
    try {
      await updateTaskStatus(taskId);
      showSnackbar("Task status updated!", "success");
      loadTasks();
    } catch (error) {
      showSnackbar("Error updating status!", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  
  const getUserNameWithCompletion = (assignedUsers, completedBy) => {
    return assignedUsers.map((user) => {
      
      const isCompleted = completedBy.includes(user.userId);
      return {
        ...user,
        name: isCompleted ? `${user.name} ✔️` : user.name,
      };
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg mt-6">
      <Typography variant="h4" className="font-bold text-center text-indigo-700 mb-6">
        Task List
      </Typography>

      {tasks.length === 0 ? (
        <Typography className="text-gray-500 text-center mt-4">No tasks found.</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {tasks.map((task) => (
            <Grid item xs={12} sm={4} md={4} lg={4} key={task._id}>
              <Card className="shadow-lg rounded-lg border border-gray-300 bg-white transition-transform hover:scale-105 transform hover:shadow-2xl">
                <CardContent>
                  {/* Task Title */}
                  <Typography variant="h6" className="font-semibold text-indigo-800">
                    {task.title}
                  </Typography>
                  <Divider className="my-2" />
                  {/* Task Description */}
                  <Typography variant="body2" className="text-gray-700 mb-3">
                    {task.description}
                  </Typography>

                  {/* Task Status */}
                  <Chip
                    label={task.status}
                    color={task.status === "active" ? "success" : "error"}
                    variant="filled"
                    className="mb-2"
                  />

                  {/* Assigned Users */}
                  <Typography variant="body2" className="font-semibold text-gray-800 mt-3">
                    Assigned Users:
                  </Typography>
                  <div className="mt-1 mb-3">
                    {getUserNameWithCompletion(task.assignedUsers, task.completedBy).map((user) => (
                      <Chip
                        key={user._id}
                        label={user.name}
                        // color="primary"
                        size="small"
                        className="mr-2 mb-2"
                      />
                    ))}
                  </div>

                
                  <div className="mt-4 flex gap-4">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => toggleStatus(task._id)}
                      fullWidth
                      className="hover:bg-yellow-600"
                    >
                      Toggle Status
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, taskId: task._id })}
                      fullWidth
                      className="hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

     
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, taskId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, taskId: null })} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

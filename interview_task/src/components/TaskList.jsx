
import React, { useEffect, useState } from "react";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  updateTaskCompletion
} from "../services/taskService";
import { Card, CardContent, Typography, Button, Checkbox, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      console.log("Fetched tasks:", data); // Debugging
      setTasks(Array.isArray(data) ? data : []); // Ensure tasks is always an array
    } catch (error) {
      console.error("Error loading tasks:", error);
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

  // const toggleCompletion = async (taskId) => {
  //   try {
  //     await updateTaskCompletion(taskId);
  //     showSnackbar("Task completion updated!", "success");
  //     loadTasks();
  //   } catch (error) {
  //     showSnackbar("Error updating completion!", "error");
  //   }
  // };


  const toggleCompletion = async (taskId) => {
    try {
      await updateTaskCompletion(taskId);
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
  
      showSnackbar("Task completion updated!", "success");
    } catch (error) {
      showSnackbar("Error updating completion!", "error");
    }
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="p-6 bg-white rounded shadow mt-4">
      <Typography variant="h5" className="font-bold text-center text-blue-600">
        Tasks
      </Typography>
      
      {tasks.length === 0 ? (
        <Typography className="text-gray-500 text-center mt-4">No tasks found.</Typography>
      ) : (
        tasks.map((task) => (
          <Card key={task._id} className="mt-4 shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-bold">{task.title}</Typography>
              <Typography className="text-gray-600">{task.description}</Typography>
              <Typography className={`mt-1 font-semibold ${task.status === "active" ? "text-green-500" : "text-red-500"}`}>
                Status: {task.status}
              </Typography>

              {/* Task Completion Checkbox */}
              <div className="flex items-center mt-2">
                <Checkbox
                  checked={task.isCompleted}
                  onChange={() => toggleCompletion(task._id)}
                  color="primary"
                />
                <Typography>Task Completed</Typography>
              </div>

              {/* Buttons */}
              <div className="mt-2 flex gap-3">
                <Button variant="contained" color="warning" onClick={() => toggleStatus(task._id)}>
                  Toggle Status
                </Button>
                <Button variant="contained" color="error" onClick={() => setDeleteDialog({ open: true, taskId: task._id })}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, taskId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, taskId: null })} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
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



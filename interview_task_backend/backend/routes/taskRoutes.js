
const express = require("express");
const { createTask, getTasks, deleteTask, updateTaskStatus,updateTaskCompletion,getAssignedTasks } = require("../controllers/taskController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id/status", authMiddleware, updateTaskStatus);
router.put("/:id/completion", authMiddleware, updateTaskCompletion);

router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteTask);
router.get("/assigned", authMiddleware, getAssignedTasks);
module.exports = router;

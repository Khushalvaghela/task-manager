
const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../config/email");

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, validity, assignedUsers } = req.body;
    const io = req.app.get("io");

    if (!title || !description || !date || !validity || assignedUsers.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const assignedUserDetails = await User.find({ _id: { $in: assignedUsers } }).select("name email");

    const task = new Task({
      title,
      description,
      date,
      validity,
      assignedUsers: assignedUserDetails.map((user) => ({
        userId: user._id,
        name: user.name,
      })),
      createdBy: req.user.id,
      notifications: assignedUserDetails.map((user) => ({
        userId: user._id,
        message: `You have been assigned a new task: ${title}`,
      })),
    });

    await task.save();

    assignedUserDetails.forEach((user) => {
      sendEmail(
        user.email,
        "New Task Assigned",
        `Hello ${user.name},\n\nYou have been assigned a new task: ${title}\n\nDescription: ${description}\nDue Date: ${date}`
      );
      io.to(user._id.toString()).emit("newNotification", {
        userId: user._id,
        message: `You have been assigned a new task: ${title}`,
        read: false,
        createdAt: new Date()
      });
      io.to(user._id.toString()).emit("newTask", task);
      // io.to(user._id.toString()).emit("taskCreated", task);

    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedUsers", "name email");
    } else {
      tasks = await Task.find({ createdBy: req.user.id }).populate("assignedUsers", "name email");
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.deleteOne({ _id: req.params.id });
    req.app.get("io").emit("taskDeleted", req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = task.status === "active" ? "inactive" : "active";
    await task.save();

    req.app.get("io").emit("taskUpdated", task);
    res.json({ message: "Task status updated successfully", status: task.status });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const io = req.app.get("io");

    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;
    const isAlreadyCompleted = task.completedBy.includes(userId);

    if (isAlreadyCompleted) {
      task.completedBy = task.completedBy.filter(id => id.toString() !== userId);
    } else {
      task.completedBy.push(userId);
    }

    await task.save();

    const allAssignedUsersCompleted = task.assignedUsers.every(user => 
      task.completedBy.includes(user.userId.toString())
    );

    if (allAssignedUsersCompleted) {
      const taskCreator = await User.findById(task.createdBy);
      sendEmail(
        taskCreator.email,
        "Task Completed",
        `Hello ${taskCreator.name},\n\nThe task \"${task.title}\" has been completed by all assigned users.\n\nDescription: ${task.description}\nCompletion Date: ${new Date().toLocaleDateString()}`
      );

      task.notifications.push({
        userId: task.createdBy,
        message: `The task \"${task.title}\" has been completed by all assigned users.`,
        read: false,
      });
      await task.save();
    }

    // io.emit("taskCompletionUpdated", task);
    io.emit("taskCompleted", task); 

    res.json({ message: "Task completion updated!", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ "assignedUsers.userId": req.user.id }).populate("createdBy", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

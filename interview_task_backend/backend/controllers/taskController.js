
const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../config/email");


exports.createTask = async (req, res) => {
  try {
    const { title, description, date, validity, assignedUsers } = req.body;

    if (!title || !description || !date || !validity || assignedUsers.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    
    // const assignedUserDetails = await User.find({ _id: { $in: assignedUsers } }).select("name");
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
    });

    await task.save();

    
    assignedUserDetails.forEach((user) => {
      sendEmail(
        user.email,
        "New Task Assigned",
        `Hello ${user.name},\n\nYou have been assigned a new task: ${title}\n\nDescription: ${description}\nDue Date: ${date}`
      );
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

    // ✅ Allow Task Creator or Admin to Delete
    if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.deleteOne({ _id: req.params.id });
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

    res.json({ message: "Task status updated successfully", status: task.status });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// exports.updateTaskCompletion = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.isCompleted = !task.isCompleted;
//     await task.save();

//     res.json({ message: "Task completion updated!", task });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
exports.updateTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;
    const isAlreadyCompleted = task.completedBy.includes(userId);

    if (isAlreadyCompleted) {
      task.completedBy = task.completedBy.filter(id => id.toString() !== userId);
    } else {
      task.completedBy.push(userId);
    }

    await task.save();
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

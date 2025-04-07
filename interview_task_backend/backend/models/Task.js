

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  validity: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  assignedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isCompleted: { type: Boolean, default: false },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String },
      read: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Task", TaskSchema);

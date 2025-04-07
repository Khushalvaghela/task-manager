const Task = require("../models/Task");

exports.getUserNotifications = async (req, res) => {
  try {
    const tasks = await Task.find({ "notifications.userId": req.user.id });

    const notifications = tasks.flatMap(task =>
      task.notifications.filter(notification => notification.userId.toString() === req.user.id)
    );

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Task.updateMany(
      { "notifications.userId": req.user.id },
      { $set: { "notifications.$[elem].read": true } },
      { arrayFilters: [{ "elem.userId": req.user.id }] }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

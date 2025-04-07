const express = require("express");
const { getUserNotifications, markNotificationsAsRead } = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/read", authMiddleware, markNotificationsAsRead);

module.exports = router;

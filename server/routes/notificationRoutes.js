const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  createNotification,
  markAllAsRead,
} = require("../controllers/notificationController");

router.route("/")
  .get(protect, getNotifications)
  .post(protect, createNotification);

router.route("/read-all")
  .put(protect, markAllAsRead);

module.exports = router;

// routes/notificationRoutes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

// Create a new notification (for internal use, e.g., by cron jobs)
router.post('/', auth, notificationController.createNotification);

// Get all notifications for the logged-in user
router.get('/', auth, notificationController.getNotifications);

// Mark a notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
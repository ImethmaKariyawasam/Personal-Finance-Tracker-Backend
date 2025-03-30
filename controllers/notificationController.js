// controllers/notificationController.js
const Notification = require('../models/Notification');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing notifications
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the notification
 *         userId:
 *           type: string
 *           description: The ID of the user who received the notification
 *         message:
 *           type: string
 *           description: The message content of the notification
 *         type:
 *           type: string
 *           enum: [spending, recurring, general]
 *           description: The type of notification (e.g., spending, recurring, general)
 *         read:
 *           type: boolean
 *           description: Whether the notification has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e1
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e2
 *         message: Unusual spending pattern detected.
 *         type: spending
 *         read: false
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user who will receive the notification
 *               message:
 *                 type: string
 *                 description: The message content of the notification
 *               type:
 *                 type: string
 *                 enum: [spending, recurring, general]
 *                 description: The type of notification
 *             example:
 *               userId: 65a1b2c3d4e5f6a7b8c9d0e2
 *               message: Unusual spending pattern detected.
 *               type: spending
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */
// Create a new notification
exports.createNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */

// Get all notifications for the logged-in user

exports.getNotifications = async (req, res) => {
    try {
      // Fetch notifications for the logged-in user
      const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 }); // Sort by latest first
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Notification not found or access denied
 */
// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



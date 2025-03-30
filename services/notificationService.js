const Notification = require('../models/Notification');

const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error; // Ensure the error is propagated
  }
};

module.exports = {
  createNotification,
};
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends an email notification to a user
 * @param {string} userId - The ID of the user
 * @param {string} subject - Email subject
 * @param {string} message - Email content
 * @param {string} type - Notification type
 * @returns {Promise<void>}
 */
const sendEmailNotification = async (userId, subject, message, type) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      throw new Error('User not found or no email address');
    }

    // Determine email template based on type
    let htmlContent;
    switch (type) {
      case 'goal':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Goal Notification</h2>
            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 5px; border-left: 5px solid #3498db;">
              ${message}
            </div>
            <p style="margin-top: 20px; color: #7f8c8d;">
              <a href="${process.env.APP_URL}/goals" style="color: #3498db;">View your goals</a>
            </p>
          </div>
        `;
        break;
      case 'spending':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e74c3c;">Spending Alert</h2>
            <div style="background-color: #fde8e8; padding: 20px; border-radius: 5px; border-left: 5px solid #e74c3c;">
              ${message}
            </div>
            <p style="margin-top: 20px; color: #7f8c8d;">
              <a href="${process.env.APP_URL}/transactions" style="color: #3498db;">Review your transactions</a>
            </p>
          </div>
        `;
        break;
      default:
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Personal Finance Tracker</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
              ${message}
            </div>
          </div>
        `;
    }

    await transporter.sendMail({
      from: `"Personal Finance Tracker" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: subject,
      html: htmlContent
    });

    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

module.exports = { sendEmailNotification };
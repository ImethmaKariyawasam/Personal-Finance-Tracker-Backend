const User = require('../models/User');
const Goal = require('../models/Goal');


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API for admin-only operations (e.g., managing users and goals)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The role of the user (user or admin)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e1
 *         username: john_doe
 *         email: john@example.com
 *         password: hashed_password
 *         role: user
 *         createdAt: 2023-12-15T10:00:00.000Z
 *
 *     Goal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the goal
 *         userId:
 *           type: string
 *           description: The ID of the user who created the goal
 *         name:
 *           type: string
 *           description: The name of the goal
 *         targetAmount:
 *           type: number
 *           description: The target amount for the goal
 *         currentAmount:
 *           type: number
 *           description: The current amount saved for the goal
 *         deadline:
 *           type: string
 *           format: date
 *           description: The deadline for the goal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the goal was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e2
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e1
 *         name: Buy a Car
 *         targetAmount: 10000
 *         currentAmount: 5000
 *         deadline: 2024-12-31
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all users. This endpoint is restricted to admin users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (access denied for non-admin users)
 */
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/**
 * @swagger
 * /admin/goals:
 *   get:
 *     summary: Get all goals (Admin only)
 *     description: Retrieve a list of all goals for all users. This endpoint is restricted to admin users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (access denied for non-admin users)
 */

// Get all goals (for all users)
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find().populate('userId', 'username');
    res.json(goals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: Delete a user by ID. This endpoint is restricted to admin users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (access denied for non-admin users)
 *       404:
 *         description: User not found
 */
// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};









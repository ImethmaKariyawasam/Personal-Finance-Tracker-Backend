const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for admin and user dashboards
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
 *         role: user
 *         createdAt: 2023-12-15T10:00:00.000Z
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the transaction
 *         userId:
 *           type: string
 *           description: The ID of the user who created the transaction
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: The type of transaction (income or expense)
 *         amount:
 *           type: number
 *           description: The amount of the transaction
 *         category:
 *           type: string
 *           description: The category of the transaction (e.g., Food, Transportation)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the transaction was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e2
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e1
 *         type: expense
 *         amount: 100
 *         category: Food
 *         createdAt: 2023-12-15T10:00:00.000Z
 *
 *     Budget:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the budget
 *         userId:
 *           type: string
 *           description: The ID of the user who created the budget
 *         category:
 *           type: string
 *           description: The category of the budget (e.g., Food, Transportation)
 *         limit:
 *           type: number
 *           description: The spending limit for the budget
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the budget was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e3
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e1
 *         category: Food
 *         limit: 500
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
 *         title:
 *           type: string
 *           description: The title of the goal
 *         description:
 *           type: string
 *           description: The description of the goal
 *         targetDate:
 *           type: string
 *           format: date
 *           description: The target date for the goal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the goal was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e4
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e1
 *         title: Save for Vacation
 *         description: Save $5000 for a vacation
 *         targetDate: 2024-12-31
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Retrieve data for the admin dashboard, including all users and transactions. This endpoint is restricted to admin users.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (access denied for non-admin users)
 */
// Admin dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find();
    const transactions = await Transaction.find();
    res.json({ users, transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     description: Retrieve data for the user dashboard, including transactions, budgets, and goals for the logged-in user.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 budgets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *                 goals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request
 */
// User dashboard
exports.getUserDashboard = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    const budgets = await Budget.find({ userId: req.user.userId });
    const goals = await Goal.find({ userId: req.user.userId });
    res.json({ transactions, budgets, goals });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};






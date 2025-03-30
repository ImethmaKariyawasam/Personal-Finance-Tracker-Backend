const Transaction = require('../models/Transaction');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API for generating financial reports and trends
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SpendingTrend:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: The category of the spending (e.g., Food, Transportation)
 *         totalAmount:
 *           type: number
 *           description: The total amount spent in this category
 *       example:
 *         Food: 300
 *         Transportation: 150
 */

/**
 * @swagger
 * /reports/spending-trends:
 *   get:
 *     summary: Get spending trends for the logged-in user
 *     description: Retrieve spending trends by category for the logged-in user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spending trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               example:
 *                 Food: 300
 *                 Transportation: 150
 *       400:
 *         description: Bad request
 */
// Get spending trends
exports.getSpendingTrends = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId, type: 'expense' });
    const trends = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
    res.json(trends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};






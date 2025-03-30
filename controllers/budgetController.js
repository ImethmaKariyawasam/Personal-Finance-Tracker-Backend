const Budget = require('../models/Budget');

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: API for managing budgets
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e1
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e2
 *         category: Food
 *         limit: 500
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the budget (e.g., Food, Transportation)
 *               limit:
 *                 type: number
 *                 description: The spending limit for the budget
 *             example:
 *               category: Food
 *               limit: 500
 *     responses:
 *       201:
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Bad request
 */
// Create a new budget
exports.createBudget = async (req, res) => {
  const { category, limit } = req.body;
  try {
    const budget = new Budget({ userId: req.user.userId, category, limit });
    const savedBudget = await budget.save(); // Save the budget and store the result

    // Log the saved budget to verify the response
    //console.log(savedBudget);

    res.status(201).json(savedBudget); // Return the saved budget
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets for the logged-in user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Bad request
 */
// Get all budgets for the logged-in user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId });
    res.json(budgets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The budget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the budget (e.g., Food, Transportation)
 *               limit:
 *                 type: number
 *                 description: The spending limit for the budget
 *             example:
 *               category: Food
 *               limit: 600
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Budget not found
 */
// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true } // Return the updated document
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' }); // Handle case where budget is not found
    }

    res.json(budget); // Return the updated budget
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The budget ID
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Budget not found
 */
// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' }); // Handle case where budget is not found
    }

    res.json({ message: 'Budget deleted successfully' }); // Return success message
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Goal = require('../models/Goal');
const { createNotification } = require('../services/notificationService');

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: API for managing financial goals
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e1
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e2
 *         title: Save for Vacation
 *         description: Save $5000 for a vacation
 *         targetDate: 2024-12-31
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the goal
 *               description:
 *                 type: string
 *                 description: The description of the goal
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 description: The target date for the goal
 *             example:
 *               title: Save for Vacation
 *               description: Save $5000 for a vacation
 *               targetDate: 2024-12-31
 *     responses:
 *       201:
 *         description: Goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request
 */
// Create a new goal
exports.createGoal = async (req, res) => {
  const { title, description, targetDate } = req.body;
  try {
    const goal = new Goal({ userId: req.user.userId, title, description, targetDate });
    const savedGoal = await goal.save(); // Save the goal and store the result

    // Create a notification for the user
    const notificationMessage = `You have successfully created a new goal: ${title}.`;
    await createNotification(req.user.userId, notificationMessage, 'goal');

    res.status(201).json(savedGoal); // Return the saved goal
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals for the logged-in user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request
 */
// Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /goals/{id}:
 *   put:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the goal
 *               description:
 *                 type: string
 *                 description: The description of the goal
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 description: The target date for the goal
 *             example:
 *               title: Save for Car
 *               description: Save $10000 for a car
 *               targetDate: 2025-12-31
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Goal not found
 */
// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true } // Return the updated document
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' }); // Handle case where goal is not found
    }

    res.json(goal); // Return the updated goal
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Goal not found
 */
// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' }); // Handle case where goal is not found
    }

    res.json({ message: 'Goal deleted successfully' }); // Return success message
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
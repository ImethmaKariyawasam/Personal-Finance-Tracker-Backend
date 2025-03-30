const Transaction = require('../models/Transaction');
const { convertCurrency } = require('../services/currencyService');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transactions
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *         currency:
 *           type: string
 *           description: The currency of the transaction
 *         category:
 *           type: string
 *           description: The category of the transaction (e.g., Food, Transportation)
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Custom tags for the transaction
 *         isRecurring:
 *           type: boolean
 *           description: Whether the transaction is recurring
 *         recurrencePattern:
 *           type: string
 *           description: The recurrence pattern (e.g., daily, weekly, monthly)
 *         endDate:
 *           type: string
 *           format: date
 *           description: The end date for recurring transactions
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the transaction was created
 *       example:
 *         _id: 65a1b2c3d4e5f6a7b8c9d0e1
 *         userId: 65a1b2c3d4e5f6a7b8c9d0e2
 *         type: expense
 *         amount: 100
 *         currency: USD
 *         category: Food
 *         tags: [groceries]
 *         isRecurring: false
 *         recurrencePattern: null
 *         endDate: null
 *         createdAt: 2023-12-15T10:00:00.000Z
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 */
exports.createTransaction = async (req, res) => {
  const { type, amount, currency, category, tags, isRecurring, recurrencePattern, endDate } = req.body;

  try {
    // Convert amount to base currency (e.g., USD) if the currency is not USD
    const baseAmount = currency === 'USD' ? amount : await convertCurrency(amount, currency, 'USD');

    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      amount: baseAmount,
      currency: 'USD', // Store all transactions in base currency
      category,
      tags,
      isRecurring,
      recurrencePattern,
      endDate
    });

    // Save the transaction
    const savedTransaction = await transaction.save();

    // Send the saved transaction in the response
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 */
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Transaction not found
 */
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Transaction not found
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
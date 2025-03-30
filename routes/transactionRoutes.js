// routes/transactionRoutes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

// Create a new transaction
router.post('/', auth, transactionController.createTransaction);

// Get all transactions for the logged-in user
router.get('/', auth, transactionController.getTransactions);

// Update a transaction
router.put('/:id', auth, transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;
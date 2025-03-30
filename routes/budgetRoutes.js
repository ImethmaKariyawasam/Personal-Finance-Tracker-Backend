// routes/budgetRoutes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const budgetController = require('../controllers/budgetController');
const router = express.Router();

// Create a new budget
router.post('/', auth, budgetController.createBudget);

// Get all budgets for the logged-in user
router.get('/', auth, budgetController.getBudgets);

// Update a budget
router.put('/:id', auth, budgetController.updateBudget);

// Delete a budget
router.delete('/:id', auth, budgetController.deleteBudget);

module.exports = router;
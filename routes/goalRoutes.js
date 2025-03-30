const express = require('express');
const { auth } = require('../middleware/auth'); // Import the auth middleware
const goalController = require('../controllers/goalController');
const router = express.Router();

// Protect all goal routes with the auth middleware
router.post('/', auth, goalController.createGoal);
router.get('/', auth, goalController.getGoals);
router.put('/:id', auth, goalController.updateGoal);
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;
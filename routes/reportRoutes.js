const express = require('express');
const { auth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');
const router = express.Router();

// Get spending trends
router.get('/spending-trends', auth, reportController.getSpendingTrends);

module.exports = router;
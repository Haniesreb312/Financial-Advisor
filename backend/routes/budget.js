const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', budgetController.getBudgets);
router.get('/current', budgetController.getCurrentBudget);
router.post('/', budgetController.upsertBudget);
router.delete('/:month/:year', budgetController.deleteBudget);

module.exports = router;

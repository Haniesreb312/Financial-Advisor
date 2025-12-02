const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', portfolioController.getPortfolio);
router.put('/', portfolioController.updatePortfolio);

module.exports = router;

const express = require('express');
const router = express.Router();
const retirementController = require('../controllers/retirementController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', retirementController.getRetirementPlans);
router.post('/', retirementController.createRetirementPlan);
router.put('/:id', retirementController.updateRetirementPlan);
router.delete('/:id', retirementController.deleteRetirementPlan);

module.exports = router;

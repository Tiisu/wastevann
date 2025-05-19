const express = require('express');
const router = express.Router();
const wasteReportController = require('../controllers/wasteReportController');

// GET all waste reports
router.get('/', wasteReportController.getAllWasteReports);

// GET a single waste report
router.get('/:id', wasteReportController.getWasteReportById);

// POST a new waste report
router.post('/', wasteReportController.createWasteReport);

// PUT update a waste report
router.put('/:id', wasteReportController.updateWasteReport);

// DELETE a waste report
router.delete('/:id', wasteReportController.deleteWasteReport);

module.exports = router;

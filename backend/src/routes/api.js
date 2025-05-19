const express = require('express');
const router = express.Router();
const wasteReportRoutes = require('./wasteReportRoutes');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Waste report routes
router.use('/waste-reports', wasteReportRoutes);

module.exports = router;

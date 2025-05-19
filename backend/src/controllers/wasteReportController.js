const WasteReport = require('../models/WasteReport');

// Get all waste reports
exports.getAllWasteReports = async (req, res) => {
  try {
    const wasteReports = await WasteReport.find();
    res.status(200).json(wasteReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single waste report by ID
exports.getWasteReportById = async (req, res) => {
  try {
    const wasteReport = await WasteReport.findById(req.params.id);
    if (!wasteReport) {
      return res.status(404).json({ message: 'Waste report not found' });
    }
    res.status(200).json(wasteReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new waste report
exports.createWasteReport = async (req, res) => {
  try {
    const newWasteReport = new WasteReport(req.body);
    const savedWasteReport = await newWasteReport.save();
    res.status(201).json(savedWasteReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a waste report
exports.updateWasteReport = async (req, res) => {
  try {
    const updatedWasteReport = await WasteReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedWasteReport) {
      return res.status(404).json({ message: 'Waste report not found' });
    }
    res.status(200).json(updatedWasteReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a waste report
exports.deleteWasteReport = async (req, res) => {
  try {
    const wasteReport = await WasteReport.findByIdAndDelete(req.params.id);
    if (!wasteReport) {
      return res.status(404).json({ message: 'Waste report not found' });
    }
    res.status(200).json({ message: 'Waste report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

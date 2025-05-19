const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  plasticType: {
    type: Number,
    required: true,
    min: 0,
    max: 6 // Based on the PlasticType enum in the frontend
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  reporterId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'collected', 'verified'],
    default: 'pending'
  },
  rewardEstimate: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
wasteReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const WasteReport = mongoose.model('WasteReport', wasteReportSchema);

module.exports = WasteReport;

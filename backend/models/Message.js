const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  reportId: {
    type: Number,
    required: true,
    index: true
  },
  sender: {
    type: String,
    required: true,
    lowercase: true,
    match: /^0x[a-fA-F0-9]{40}$/ // Ethereum address validation
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  isFromAgent: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Additional metadata
  reporterAddress: {
    type: String,
    required: true,
    lowercase: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  collectedBy: {
    type: String,
    lowercase: true,
    match: /^0x[a-fA-F0-9]{40}$/,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  // For message threading (future enhancement)
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
messageSchema.index({ reportId: 1, timestamp: 1 });
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ reporterAddress: 1, timestamp: -1 });

// Virtual for message ID (using MongoDB _id)
messageSchema.virtual('messageId').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
messageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Message', messageSchema);
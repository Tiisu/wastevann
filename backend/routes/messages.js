const express = require('express');
const Joi = require('joi');
const Message = require('../models/Message');
const { validateAddress, checkReportAccess } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const sendMessageSchema = Joi.object({
  reportId: Joi.number().integer().positive().required(),
  sender: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
  content: Joi.string().min(1).max(500).required(),
  isFromAgent: Joi.boolean().required(),
  reporterAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
  collectedBy: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).allow(null).optional()
});

const getMessagesSchema = Joi.object({
  reportId: Joi.number().integer().positive().required(),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
  since: Joi.date().iso().optional()
});

// Send a new message
router.post('/', validateAddress, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const { reportId, sender, content, isFromAgent, reporterAddress, collectedBy } = value;

    // Verify sender address matches validated address
    if (sender.toLowerCase() !== req.validatedAddress) {
      return res.status(403).json({
        error: 'Sender address does not match authenticated address'
      });
    }

    // Create new message
    const message = new Message({
      reportId,
      sender: sender.toLowerCase(),
      content: content.trim(),
      isFromAgent,
      reporterAddress: reporterAddress.toLowerCase(),
      collectedBy: collectedBy ? collectedBy.toLowerCase() : null
    });

    await message.save();

    // Emit real-time message to report room
    const io = req.app.get('io');
    io.to(`report-${reportId}`).emit('new-message', {
      messageId: message.messageId,
      reportId: message.reportId,
      sender: message.sender,
      content: message.content,
      isFromAgent: message.isFromAgent,
      timestamp: message.timestamp
    });

    res.status(201).json({
      success: true,
      message: {
        messageId: message.messageId,
        reportId: message.reportId,
        sender: message.sender,
        content: message.content,
        isFromAgent: message.isFromAgent,
        timestamp: message.timestamp
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message'
    });
  }
});

// Get messages for a specific report
router.get('/report/:reportId', validateAddress, checkReportAccess, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { limit = 50, offset = 0, since } = req.query;

    // Validate query parameters
    const { error, value } = getMessagesSchema.validate({
      reportId: parseInt(reportId),
      limit: parseInt(limit),
      offset: parseInt(offset),
      since
    });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    // Build query
    const query = { reportId: value.reportId };
    if (value.since) {
      query.timestamp = { $gte: new Date(value.since) };
    }

    // Get messages with pagination
    const messages = await Message.find(query)
      .sort({ timestamp: 1 }) // Oldest first for chat display
      .skip(value.offset)
      .limit(value.limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Message.countDocuments(query);

    // Format response
    const formattedMessages = messages.map(msg => ({
      messageId: msg._id.toString(),
      reportId: msg.reportId,
      sender: msg.sender,
      content: msg.content,
      isFromAgent: msg.isFromAgent,
      timestamp: msg.timestamp
    }));

    res.json({
      success: true,
      messages: formattedMessages,
      pagination: {
        total: totalCount,
        limit: value.limit,
        offset: value.offset,
        hasMore: (value.offset + value.limit) < totalCount
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Failed to retrieve messages'
    });
  }
});

// Get unread message count for a user
router.get('/unread/:address', validateAddress, async (req, res) => {
  try {
    const { address } = req.params;
    const { since } = req.query;

    if (address.toLowerCase() !== req.validatedAddress) {
      return res.status(403).json({
        error: 'Address does not match authenticated address'
      });
    }

    const query = {
      $or: [
        { reporterAddress: req.validatedAddress },
        { collectedBy: req.validatedAddress }
      ],
      sender: { $ne: req.validatedAddress }, // Exclude own messages
      isRead: false
    };

    if (since) {
      query.timestamp = { $gte: new Date(since) };
    }

    const unreadCount = await Message.countDocuments(query);

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to get unread message count'
    });
  }
});

// Mark messages as read
router.patch('/read', validateAddress, async (req, res) => {
  try {
    const { reportId, messageIds } = req.body;

    if (!reportId && !messageIds) {
      return res.status(400).json({
        error: 'Either reportId or messageIds must be provided'
      });
    }

    let query = {
      sender: { $ne: req.validatedAddress }, // Don't mark own messages as read
      isRead: false
    };

    if (reportId) {
      query.reportId = parseInt(reportId);
      query.$or = [
        { reporterAddress: req.validatedAddress },
        { collectedBy: req.validatedAddress }
      ];
    } else if (messageIds && Array.isArray(messageIds)) {
      query._id = { $in: messageIds };
    }

    const result = await Message.updateMany(query, { isRead: true });

    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Failed to mark messages as read'
    });
  }
});

// Get message statistics for a user
router.get('/stats/:address', validateAddress, async (req, res) => {
  try {
    const { address } = req.params;

    if (address.toLowerCase() !== req.validatedAddress) {
      return res.status(403).json({
        error: 'Address does not match authenticated address'
      });
    }

    const [totalSent, totalReceived, unreadCount] = await Promise.all([
      Message.countDocuments({ sender: req.validatedAddress }),
      Message.countDocuments({
        $or: [
          { reporterAddress: req.validatedAddress },
          { collectedBy: req.validatedAddress }
        ],
        sender: { $ne: req.validatedAddress }
      }),
      Message.countDocuments({
        $or: [
          { reporterAddress: req.validatedAddress },
          { collectedBy: req.validatedAddress }
        ],
        sender: { $ne: req.validatedAddress },
        isRead: false
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalSent,
        totalReceived,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get message statistics'
    });
  }
});

module.exports = router;
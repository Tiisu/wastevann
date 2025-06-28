const { ethers } = require('ethers');

// Middleware to verify Ethereum address signature
const verifySignature = async (req, res, next) => {
  try {
    const { address, signature, message } = req.body;
    
    if (!address || !signature || !message) {
      return res.status(400).json({
        error: 'Missing required fields: address, signature, message'
      });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    // Add verified address to request
    req.userAddress = address.toLowerCase();
    next();
  } catch (error) {
    console.error('Signature verification error:', error);
    res.status(401).json({
      error: 'Signature verification failed'
    });
  }
};

// Simple address validation middleware
const validateAddress = (req, res, next) => {
  const address = req.params.address || req.body.sender || req.query.address;
  
  if (!address) {
    return res.status(400).json({
      error: 'Ethereum address is required'
    });
  }

  // Basic Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({
      error: 'Invalid Ethereum address format'
    });
  }

  req.validatedAddress = address.toLowerCase();
  next();
};

// Middleware to check if user is authorized for a specific report
const checkReportAccess = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const userAddress = req.userAddress || req.validatedAddress;
    
    if (!reportId || !userAddress) {
      return res.status(400).json({
        error: 'Report ID and user address are required'
      });
    }

    // Here you would typically check against your smart contract
    // For now, we'll implement basic validation
    // In a real implementation, you'd query the blockchain to verify:
    // 1. The report exists
    // 2. The user is either the reporter or a verified agent
    // 3. If collected, only reporter and collecting agent can access
    
    req.reportId = parseInt(reportId);
    req.userAddress = userAddress;
    next();
  } catch (error) {
    console.error('Report access check error:', error);
    res.status(500).json({
      error: 'Failed to verify report access'
    });
  }
};

module.exports = {
  verifySignature,
  validateAddress,
  checkReportAccess
};
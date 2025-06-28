# WasteVan Smart Contract Integration Guide

## Overview

This document outlines the complete integration between the WasteVan smart contracts and the React frontend, ensuring seamless functionality for the decentralized waste management system.

## Smart Contract Architecture

### WasteVan Contract (Main Contract)
- **Address**: `0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0`
- **Purpose**: Handles user registration, waste reporting, and agent verification
- **Key Functions**:
  - `registerUser(username, email)` - Register new users
  - `registerAgent()` - Register new agents (with 1000 WVT bonus)
  - `reportWaste(ipfsHash, quantity, wasteType, location)` - Submit waste reports
  - `approveWaste(reportId)` - Agents approve and collect waste
  - `rejectWaste(reportId, reason)` - Agents reject waste reports

### WasteVanToken Contract (ERC20 Token)
- **Address**: `0x5257C0710C6f9A0320cEdD4a95f895caCE29F42C`
- **Purpose**: WVT token for rewards (1 WVT = 1 kg of waste)
- **Key Functions**:
  - `mint(to, amount)` - Mint new tokens (only authorized minters)
  - `balanceOf(address)` - Check token balance
  - `addMinter(address)` - Add authorized minter (owner only)

## Key Integration Fixes Applied

### 1. Fixed Reward System
**Problem**: Original system required agents to transfer their own tokens to users, creating a circular dependency.

**Solution**: Changed to direct token minting when waste is approved.

```solidity
// OLD (problematic):
require(agentBalance >= report.tokenReward, "Insufficient token balance");
wasteVanToken.transferFromAgent(msg.sender, report.reporter, report.tokenReward);

// NEW (fixed):
wasteVanToken.mint(report.reporter, report.tokenReward);
```

### 2. Enhanced Frontend Integration
**Improvements**:
- Added location parameter support in waste reporting
- Updated ContractContext to handle location-based reporting
- Fixed contract function calls to use proper minting mechanism

### 3. Proper Error Handling
**Added**:
- Comprehensive error messages for failed transactions
- Fallback mechanisms for IPFS uploads
- Network validation for Sepolia testnet

## Frontend Integration Points

### 1. Contract Utilities (`Frontend/src/utils/contracts.ts`)
```typescript
// Key functions for blockchain interaction
export const getContract = async () => { ... }
export const registerUser = async (username, email) => { ... }
export const reportWasteWithLocation = async (ipfsHash, quantity, wasteType, location) => { ... }
export const approveWaste = async (reportId) => { ... }
```

### 2. Contract Context (`Frontend/src/context/ContractContext.tsx`)
```typescript
// React context for managing contract state
const ContractProvider = ({ children }) => { ... }
export const useContract = () => { ... }
```

### 3. Environment Configuration (`Frontend/.env`)
```env
VITE_WASTE_VAN_TOKEN_ADDRESS=0x5257C0710C6f9A0320cEdD4a95f895caCE29F42C
VITE_WASTE_VAN_ADDRESS=0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_PINATA_JWT=your_pinata_jwt_token
```

## User Flow Integration

### 1. User Registration
```typescript
// Frontend calls
await connectWallet();
await registerUser(username, email);

// Smart contract execution
WasteVan.registerUser(username, email);
```

### 2. Waste Reporting
```typescript
// Frontend process
const ipfsHash = await uploadToIPFS(imageFile);
await reportWasteWithLocation(ipfsHash, quantity, wasteType, location);

// Smart contract execution
WasteVan.reportWaste(ipfsHash, quantity, wasteType, location);
// Calculates reward: quantity * 1 WVT per kg
```

### 3. Agent Verification
```typescript
// Frontend calls
await approveWaste(reportId);

// Smart contract execution
WasteVan.approveWaste(reportId);
// Mints tokens directly to user
WasteVanToken.mint(userAddress, tokenReward);
```

## Token Economics

### Reward Calculation
- **Rate**: 1 WVT per kg of waste reported
- **Implementation**: `tokenReward = quantity * TOKENS_PER_POINT`
- **Where**: `TOKENS_PER_POINT = 1 * 10^18` (1 token in wei)

### Agent Incentives
- **Registration Bonus**: 1000 WVT tokens
- **Collection Points**: 100 points per waste collection
- **Token Distribution**: Agents mint new tokens for users (no transfer from agent balance)

## Security Features

### 1. Access Control
- Only registered users can report waste
- Only verified agents can approve/reject waste
- Only contract owner can add minters
- Deployer automatically becomes first agent

### 2. Validation
- IPFS hash validation for waste images
- Quantity and location requirements
- Duplicate report prevention via QR codes
- Network validation (Sepolia testnet)

### 3. Error Handling
- Graceful fallbacks for failed IPFS uploads
- Transaction failure recovery
- Comprehensive error messages

## Deployment Verification

### Required Checks
1. **Contract Deployment**: Both contracts deployed to Sepolia
2. **Minter Permissions**: WasteVan contract authorized as minter
3. **Agent Registration**: Deployer registered as first agent
4. **Frontend Configuration**: Contract addresses in environment variables
5. **ABI Files**: Updated contract ABIs in Frontend/contractABI/

### Testing Commands
```bash
# Verify deployment
npm run verify-deployment

# Test reward system
npm run test-rewards

# Check setup
npm run check-setup
```

## Common Issues & Solutions

### 1. "Token minting failed"
**Cause**: WasteVan contract not authorized as minter
**Solution**: Run `npm run setup-minter`

### 2. "User not registered"
**Cause**: User trying to report waste without registration
**Solution**: Complete user registration first

### 3. "Network mismatch"
**Cause**: MetaMask not on Sepolia testnet
**Solution**: Switch MetaMask to Sepolia testnet

### 4. "IPFS upload failed"
**Cause**: Invalid Pinata credentials
**Solution**: Update Pinata keys in Frontend/.env

## Performance Optimizations

### 1. Batch Processing
- Waste reports fetched in batches of 10
- Reduces blockchain query load
- Improves dashboard loading times

### 2. Caching
- User and agent stats cached in React context
- Token balances updated only after transactions
- IPFS hashes stored locally for quick access

### 3. Error Recovery
- Automatic retry for failed transactions
- Fallback IPFS upload methods
- Graceful degradation for network issues

## Future Enhancements

### 1. Multi-Agent Support
- On-chain governance for agent approval
- Geographic zone assignments
- Agent staking mechanisms

### 2. Advanced Tokenomics
- Dynamic reward rates based on waste type
- Seasonal multipliers
- Community voting on reward parameters

### 3. Cross-Chain Integration
- Multi-network deployment
- Bridge contracts for token transfers
- Unified user experience across chains

## Conclusion

The WasteVan smart contract integration provides a robust, decentralized foundation for waste management incentivization. The fixed reward system ensures sustainable token distribution, while the comprehensive frontend integration delivers a seamless user experience.

All critical issues have been resolved:
- ✅ Reward system uses direct minting instead of transfers
- ✅ Location-based waste reporting implemented
- ✅ Comprehensive error handling and validation
- ✅ Proper agent incentive structure
- ✅ Secure access control and permissions

The system is now ready for production use on the Sepolia testnet with plans for mainnet deployment.
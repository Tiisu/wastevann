# WasteVan Fully On-Chain Reward System

## Overview

The WasteVan DApp implements a comprehensive, fully decentralized reward system where users earn WasteVan Tokens (WVT) for reporting waste, and agents (waste collectors) verify and collect the waste to distribute rewards. All data and logic is stored and executed on-chain with no backend dependencies.

## How It Works

### 1. User Registration
- Users must register with username and email before reporting waste
- Registration is done through the smart contract and stored on-chain

### 2. Waste Reporting
- Registered users can report waste by providing:
  - IPFS hash of waste image (uploaded via Pinata)
  - Quantity of waste (in kg)
  - Type of waste (PET, HDPE, PVC, LDPE, PP, PS, Other)
  - Location (GPS coordinates or description)
- Each report automatically calculates token reward: `quantity * 1 WVT per kg`

### 3. Agent Verification & Collection
- The contract deployer is automatically registered as the first agent
- Agents can view all pending waste reports on the agent dashboard
- Agents verify waste collection by scanning QR codes
- Upon verification, the smart contract:
  - Marks the waste as collected
  - Awards points to the agent (100 points per collection)
  - Mints and distributes WVT tokens to the original reporter

### 4. Token Distribution
- Tokens are automatically minted and sent to users when waste is verified
- The WasteVan contract must be authorized as a minter on the WasteVanToken contract
- If minting fails, the owner can manually distribute tokens later

## Smart Contract Architecture

### WasteVan Contract
- Main contract handling user registration, waste reporting, and collection
- Automatically registers deployer as first agent
- Manages reward calculations and token distribution

### WasteVanToken Contract
- ERC20 token with minting capabilities
- Owner can add/remove minters
- WasteVan contract is added as authorized minter

## Key Features

### Automatic Agent Registration
- Contract deployer becomes the first agent automatically
- No need for manual agent registration for the deployer

### Real-time Blockchain Data
- Agent dashboard displays live data directly from the blockchain
- All waste reports and their status are fetched in real-time from smart contracts
- No backend servers or databases required

### Token Rewards
- 1 WVT token per kg of waste reported
- Tokens are minted and distributed automatically upon verification
- Users can see their token balance in their wallet

### Location-based Filtering
- Agents can filter waste reports by location
- Supports GPS coordinates and location descriptions

## Deployment & Setup

### 1. Deploy Contracts
```bash
npm run deploy
```

### 2. Set Up Minter Permissions (if needed)
```bash
npm run setup-minter
```

### 3. Test Reward System
```bash
npm run test-rewards
```

## Environment Variables

Create a `.env` file with:
```
VITE_WASTE_VAN_TOKEN_ADDRESS=<deployed_token_address>
VITE_WASTE_VAN_ADDRESS=<deployed_wastevan_address>
```

## Agent Dashboard Features

### Pending Reports
- View all uncollected waste reports
- See reporter address, quantity, type, location
- Display calculated token reward
- Verify collection via QR scanning

### Collected Reports
- View history of collected waste
- Track agent performance and rewards distributed

### Location Filtering
- Filter reports by location
- Use current GPS location for nearby reports

## User Flow

1. **Connect Wallet** → User connects MetaMask
2. **Register** → User provides username and email
3. **Report Waste** → User uploads image to IPFS and submits report
4. **Agent Verification** → Agent scans QR code to verify collection
5. **Reward Distribution** → Smart contract mints and sends WVT tokens to user

## Token Economics

- **Initial Supply**: 1,000,000 WVT (to deployer)
- **Agent Bonus**: 1,000 WVT (when registering as agent)
- **Reward Rate**: 1 WVT per kg of waste
- **Agent Points**: 100 points per collection

## Security Features

- Only registered users can report waste
- Only verified agents can collect waste
- QR code verification prevents fraud
- Smart contract handles all token minting
- Owner controls for emergency situations

## Future Enhancements

- Multiple agent support with on-chain governance
- Dynamic reward rates based on waste type via smart contract parameters
- Staking mechanisms for agents with slashing conditions
- Geographic zones for agent assignments using on-chain location data
- Integration with IoT devices for automated waste detection
- Cross-chain compatibility for multi-network deployment
- DAO governance for system parameters and upgrades

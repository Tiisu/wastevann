# WasteVan Deployment Guide

This guide will help you deploy the fully on-chain WasteVan DApp.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** wallet with Sepolia testnet ETH
3. **Pinata Account** for IPFS storage (free tier available)
4. **Git** for cloning the repository

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd wastevan
npm install
npm run frontend:install
```

## Step 2: Configure Environment

### Smart Contract Environment
Create `.env` in the root directory:
```env
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Frontend Environment
Create `Frontend/.env`:
```env
VITE_WASTE_VAN_TOKEN_ADDRESS=
VITE_WASTE_VAN_ADDRESS=
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_PINATA_JWT=your_pinata_jwt_token
```

## Step 3: Deploy Smart Contracts

1. **Compile contracts:**
```bash
npm run compile
```

2. **Deploy to Sepolia testnet:**
```bash
npm run deploy
```

3. **Copy the deployed addresses** from the console output and update `Frontend/.env`:
```env
VITE_WASTE_VAN_TOKEN_ADDRESS=0x...
VITE_WASTE_VAN_ADDRESS=0x...
```

4. **Set up minter permissions:**
```bash
npm run setup-minter
```

## Step 4: Test the System

```bash
npm run test-rewards
```

## Step 5: Start the Frontend

```bash
npm run frontend:dev
```

The application will be available at `http://localhost:5173`

## Verification

1. **Connect MetaMask** to Sepolia testnet
2. **Register as a user** with username and email
3. **Report waste** by uploading an image and filling details
4. **Switch to agent mode** (deployer is automatically an agent)
5. **Verify waste collection** by scanning QR codes

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Smart          │    │     IPFS        │
│   (React)       │◄──►│  Contracts      │    │   (Pinata)      │
│                 │    │  (Ethereum)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MetaMask      │    │   Blockchain    │    │  Decentralized  │
│   Wallet        │    │   Storage       │    │  File Storage   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

- **No Backend Servers**: Everything runs on blockchain and IPFS
- **Decentralized Storage**: Images stored on IPFS via Pinata
- **Smart Contract Logic**: All business logic in Solidity contracts
- **Real-time Data**: Direct blockchain queries for live data
- **Token Rewards**: Automatic ERC20 token minting and distribution

## Troubleshooting

### Common Issues

1. **Transaction Fails**: Ensure you have enough Sepolia ETH for gas fees
2. **IPFS Upload Fails**: Check Pinata API credentials in environment variables
3. **Contract Not Found**: Verify contract addresses in Frontend/.env
4. **MetaMask Issues**: Switch to Sepolia testnet and refresh the page

### Getting Testnet ETH

- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)

### Pinata Setup

1. Create account at [pinata.cloud](https://pinata.cloud)
2. Generate API keys in the dashboard
3. Add keys to Frontend/.env file

## Production Deployment

For mainnet deployment:

1. Update `hardhat.config.js` with mainnet configuration
2. Use `--network ethereum` instead of `--network ethereumSepolia`
3. Ensure sufficient ETH for deployment gas costs
4. Consider using a dedicated IPFS gateway for better performance

## Security Considerations

- Never commit private keys to version control
- Use environment variables for all sensitive data
- Test thoroughly on testnet before mainnet deployment
- Consider multi-signature wallets for contract ownership
- Implement proper access controls for production use
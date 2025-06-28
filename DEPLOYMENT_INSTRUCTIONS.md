# WasteVan Smart Contract Deployment Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** wallet with Sepolia testnet ETH
4. **Alchemy Account** (free tier available)
5. **Etherscan Account** (for contract verification - optional)

## Step 1: Environment Setup

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Configure Environment Variables
Create or update `.env` file in the root directory:

```env
# Alchemy API Key (get from https://dashboard.alchemy.com/)
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Private key of the deployer wallet (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key for contract verification (optional)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

⚠️ **Security Warning**: Never commit your private key to version control!

### 1.3 Get Testnet ETH
You'll need Sepolia testnet ETH for deployment. Get some from these faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

## Step 2: Compile Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate ABI files
- Copy artifacts to Frontend directory

## Step 3: Deploy Contracts

```bash
npm run deploy
```

This will:
1. Deploy WasteVanToken contract
2. Deploy WasteVan contract
3. Set up minter permissions
4. Verify deployer is registered as agent
5. Attempt contract verification on Etherscan (if API key provided)

### Expected Output:
```
Starting deployment...
Deploying WasteVanToken...
WasteVanToken deployed to: 0x1234567890123456789012345678901234567890
Deploying WasteVan...
WasteVan deployed to: 0x0987654321098765432109876543210987654321
Setting up minter permissions...
WasteVan contract added as minter successfully!
Verifying deployer agent registration...
✅ Deployer 0xYourAddress is registered as agent
   Points: 1000
   Total Collections: 0
Deployment completed!
WasteVanToken address: 0x1234567890123456789012345678901234567890
WasteVan address: 0x0987654321098765432109876543210987654321
```

## Step 4: Update Frontend Configuration

Copy the deployed contract addresses and update `Frontend/.env`:

```env
VITE_WASTE_VAN_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
VITE_WASTE_VAN_ADDRESS=0x0987654321098765432109876543210987654321
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_PINATA_JWT=your_pinata_jwt_token
```

## Step 5: Test Deployment (Optional)

```bash
npm run test-rewards
```

## Step 6: Start Frontend

```bash
npm run frontend:dev
```

The application will be available at `http://localhost:5173`

## Deployment Scripts Reference

### Available Scripts:
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy to Sepolia testnet
- `npm run setup-minter` - Set up minter permissions (if needed)
- `npm run test-rewards` - Test reward system
- `npm run frontend:dev` - Start frontend development server
- `npm run frontend:build` - Build frontend for production

## Troubleshooting

### Common Issues:

1. **"Insufficient funds" error**
   - Ensure your wallet has enough Sepolia ETH
   - Gas fees are required for deployment

2. **"Network connection failed"**
   - Check your Alchemy API key
   - Verify internet connection

3. **"Private key invalid"**
   - Ensure private key is correct (without 0x prefix)
   - Make sure the wallet has ETH

4. **Contract verification fails**
   - This is optional and doesn't affect functionality
   - Check Etherscan API key if verification is important

### Getting API Keys:

#### Alchemy API Key:
1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Create a free account
3. Create a new app for Ethereum Sepolia
4. Copy the API key

#### Etherscan API Key (Optional):
1. Go to [Etherscan](https://etherscan.io/)
2. Create an account
3. Go to API Keys section
4. Generate a new API key

#### Pinata Keys (For IPFS):
1. Go to [Pinata](https://pinata.cloud/)
2. Create a free account
3. Generate API keys in the dashboard
4. Add keys to Frontend/.env

## Contract Addresses (After Deployment)

After successful deployment, you'll have:

- **WasteVanToken**: ERC20 token contract for rewards
- **WasteVan**: Main application contract

Save these addresses as you'll need them for frontend configuration.

## Verification

After deployment, you can verify your contracts are working by:

1. Checking them on [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Using the frontend to register as a user
3. Creating a test waste report
4. Verifying collection as an agent

## Security Considerations

- Keep your private key secure and never share it
- Use a dedicated wallet for development/testing
- Consider using a hardware wallet for mainnet deployments
- Test thoroughly on testnet before mainnet deployment

## Next Steps

1. Configure Pinata for IPFS storage
2. Test the full user flow
3. Consider additional security audits for production
4. Plan for mainnet deployment strategy
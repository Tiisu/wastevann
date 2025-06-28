# WasteVan - Fully On-Chain Waste Management DApp

WasteVan is a decentralized application (DApp) that creates an incentivized waste management ecosystem using blockchain technology. Users earn WasteVan Tokens (WVT) for reporting waste, and verified agents collect and verify waste reports - all managed entirely on-chain.

## Key Features

- **Fully Decentralized**: No backend servers - everything runs on blockchain and IPFS
- **Token Incentives**: Earn 1 WVT token per kg of waste reported
- **Agent Verification**: QR code-based waste collection verification
- **IPFS Storage**: Decentralized image storage via Pinata
- **Multi-role System**: Different interfaces for users and agents
- **Real-time Data**: Live blockchain data integration

## Architecture

### Smart Contracts
- **WasteVan Contract**: Main contract handling user registration, waste reporting, and collection verification
- **WasteVanToken Contract**: ERC20 token for rewards (1 WVT = 1 kg of waste reported)

### Frontend
- React/TypeScript application with Web3 integration
- MetaMask wallet connection
- IPFS integration for decentralized image storage
- QR code generation and scanning for verification

### Storage
- **On-chain**: User data, waste reports, agent verification, token balances
- **IPFS**: Waste images stored via Pinata service

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask wallet
- Ethereum testnet ETH (Sepolia)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wastevan
```

2. Install dependencies:
```bash
npm install
cd Frontend && npm install
```

3. Deploy smart contracts:
```bash
npm run deploy
```

4. Set up environment variables in `Frontend/.env`:
```
VITE_WASTE_VAN_TOKEN_ADDRESS=<deployed_token_address>
VITE_WASTE_VAN_ADDRESS=<deployed_wastevan_address>
VITE_PINATA_API_KEY=<your_pinata_api_key>
VITE_PINATA_SECRET_KEY=<your_pinata_secret_key>
```

5. Start the frontend:
```bash
cd Frontend
npm run dev
```

## Development Commands

### Smart Contract Development
```shell
npm run compile          # Compile smart contracts
npm run deploy           # Deploy to Sepolia testnet
npm run setup-minter     # Set up minter permissions (if needed)
npm run test-rewards     # Test reward system
npx hardhat test         # Run contract tests
```

### Frontend Development
```shell
npm run frontend:install # Install frontend dependencies
npm run frontend:dev     # Start development server
npm run frontend:build   # Build for production
cd Frontend && npm run preview # Preview production build
```

## How It Works

1. **User Registration**: Users connect MetaMask and register with username/email
2. **Waste Reporting**: Users upload photos to IPFS, specify waste details, and submit reports
3. **Agent Verification**: Verified agents scan QR codes to verify waste collection
4. **Token Rewards**: Smart contract automatically mints and distributes WVT tokens
5. **Decentralized Storage**: All data stored on blockchain and IPFS - no centralized servers

## Token Economics

- **Initial Supply**: 1,000,000 WVT (to deployer)
- **Agent Bonus**: 1,000 WVT (when registering as agent)
- **Reward Rate**: 1 WVT per kg of waste
- **Agent Points**: 100 points per collection

## Project Structure

```
wastevan/
├── contracts/           # Smart contracts
│   ├── WasteVan.sol
│   ├── WasteVanToken.sol
│   └── Lock.sol
├── Frontend/           # React frontend application
│   ├── src/
│   ├── public/
│   └── contractABI/
├── scripts/           # Deployment and utility scripts
├── test/             # Smart contract tests
├── ignition/         # Hardhat Ignition modules
└── package.json      # Root package configuration
```

## Security Features

- Only registered users can report waste
- Only verified agents can collect waste
- QR code verification prevents fraud
- Smart contract handles all token minting
- Owner controls for emergency situations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
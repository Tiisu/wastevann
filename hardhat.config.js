require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {ALCHEMY_API_KEY, PRIVATE_KEY, ETHERSCAN_API_KEY} = process.env;

// Validate required environment variables
if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set in .env file");
}

if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set in .env file");
}

// Format private key with 0x prefix if needed
const formattedPrivateKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    ethereumSepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [formattedPrivateKey],
      chainId: 11155111
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
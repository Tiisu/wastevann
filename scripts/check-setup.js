const hre = require("hardhat");

async function main() {
  console.log("Checking Deployment Setup...\n");

  try {
    // Check network
    const network = await hre.ethers.provider.getNetwork();
    console.log("Network Information:");
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Network: ${hre.network.name}`);

    // Check deployer account
    const [signer] = await hre.ethers.getSigners();
    const deployerAddress = await signer.getAddress();
    const balance = await hre.ethers.provider.getBalance(deployerAddress);
    
    console.log("\nDeployer Account:");
    console.log(`   Address: ${deployerAddress}`);
    console.log(`   Balance: ${hre.ethers.formatEther(balance)} ETH`);

    // Check if balance is sufficient for deployment
    const minBalance = hre.ethers.parseEther("0.01");
    const hasEnoughBalance = balance >= minBalance;
    
    console.log(`   Status: ${hasEnoughBalance ? 'Ready' : 'Insufficient balance'}`);

    // Test network connection
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`\nNetwork Connection: Working (Block: ${blockNumber})`);

    // Deployment readiness
    if (hasEnoughBalance) {
      console.log("\nReady for deployment!");
      console.log("Next: npm run deploy");
    } else {
      console.log("\nGet more testnet ETH before deploying");
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
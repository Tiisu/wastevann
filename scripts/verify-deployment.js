const hre = require("hardhat");

async function main() {
  console.log("Verifying WasteVan Deployment...\n");

  // Get contract addresses from environment or prompt user
  const tokenAddress = process.env.WASTE_VAN_TOKEN_ADDRESS;
  const wasteVanAddress = process.env.WASTE_VAN_ADDRESS;

  if (!tokenAddress || !wasteVanAddress) {
    console.log("Contract addresses not found in environment variables");
    console.log("Please set WASTE_VAN_TOKEN_ADDRESS and WASTE_VAN_ADDRESS in your .env file");
    return;
  }

  try {
    // Get contract instances
    const WasteVanToken = await hre.ethers.getContractFactory("WasteVanToken");
    const WasteVan = await hre.ethers.getContractFactory("WasteVan");
    
    const wasteVanToken = WasteVanToken.attach(tokenAddress);
    const wasteVan = WasteVan.attach(wasteVanAddress);

    console.log("Contract Information:");
    console.log(`WasteVanToken: ${tokenAddress}`);
    console.log(`WasteVan: ${wasteVanAddress}\n`);

    // Verify token contract
    console.log("WasteVanToken Verification:");
    const tokenName = await wasteVanToken.name();
    const tokenSymbol = await wasteVanToken.symbol();
    const tokenDecimals = await wasteVanToken.decimals();
    const tokenTotalSupply = await wasteVanToken.totalSupply();
    
    console.log(`   Name: ${tokenName}`);
    console.log(`   Symbol: ${tokenSymbol}`);
    console.log(`   Decimals: ${tokenDecimals}`);
    console.log(`   Total Supply: ${hre.ethers.formatEther(tokenTotalSupply)} WVT`);

    // Check if WasteVan is a minter
    const isMinter = await wasteVanToken.minters(wasteVanAddress);
    console.log(`   WasteVan is minter: ${isMinter ? 'Yes' : 'No'}`);

    // Verify WasteVan contract
    console.log("\nWasteVan Contract Verification:");
    const linkedTokenAddress = await wasteVan.wasteVanToken();
    console.log(`   Linked Token: ${linkedTokenAddress}`);
    console.log(`   Token Link Valid: ${linkedTokenAddress.toLowerCase() === tokenAddress.toLowerCase() ? 'Yes' : 'No'}`);

    // Check deployer agent status
    const [signer] = await hre.ethers.getSigners();
    const deployerAddress = await signer.getAddress();
    const agentStats = await wasteVan.getAgentStats(deployerAddress);
    
    console.log(`\nDeployer Agent Status (${deployerAddress}):`);
    console.log(`   Is Verified Agent: ${agentStats[0] ? 'Yes' : 'No'}`);
    console.log(`   Points: ${agentStats[1]}`);
    console.log(`   Total Collections: ${agentStats[2]}`);
    console.log(`   Points Distributed: ${agentStats[3]}`);

    // Check deployer token balance
    const deployerBalance = await wasteVanToken.balanceOf(deployerAddress);
    console.log(`   Token Balance: ${hre.ethers.formatEther(deployerBalance)} WVT`);

    // Get contract stats
    const totalUsers = await wasteVan.totalUsers();
    const totalReports = await wasteVan.reportCounter();
    
    console.log(`\nPlatform Statistics:`);
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Total Reports: ${totalReports}`);

    console.log("\nDeployment verification completed!");
    
    if (isMinter && agentStats[0]) {
      console.log("\nAll systems ready! You can now:");
      console.log("   1. Start the frontend application");
      console.log("   2. Register users and create waste reports");
      console.log("   3. Verify collections as an agent");
    } else {
      console.log("\nSetup incomplete. Please run:");
      if (!isMinter) console.log("   npm run setup-minter");
      if (!agentStats[0]) console.log("   Check agent registration in deployment logs");
    }

  } catch (error) {
    console.error("Error during verification:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Ensure contract addresses are correct");
    console.log("2. Check network connection");
    console.log("3. Verify contracts are deployed on the correct network");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
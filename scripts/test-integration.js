const hre = require("hardhat");

async function main() {
  console.log("Testing WasteVan Smart Contract Integration...");
  
  // Get deployed contract addresses from environment
  const WASTE_VAN_TOKEN_ADDRESS = process.env.VITE_WASTE_VAN_TOKEN_ADDRESS || "0x5257C0710C6f9A0320cEdD4a95f895caCE29F42C";
  const WASTE_VAN_ADDRESS = process.env.VITE_WASTE_VAN_ADDRESS || "0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0";

  console.log("Token Address:", WASTE_VAN_TOKEN_ADDRESS);
  console.log("WasteVan Address:", WASTE_VAN_ADDRESS);

  try {
    // Get contract instances
    const WasteVanToken = await hre.ethers.getContractFactory("WasteVanToken");
    const wasteVanToken = WasteVanToken.attach(WASTE_VAN_TOKEN_ADDRESS);

    const WasteVan = await hre.ethers.getContractFactory("WasteVan");
    const wasteVan = WasteVan.attach(WASTE_VAN_ADDRESS);

    const [signer] = await hre.ethers.getSigners();
    const deployerAddress = await signer.getAddress();

    console.log("\n=== Testing Contract Connections ===");
    
    // Test 1: Check if contracts are accessible
    const tokenName = await wasteVanToken.name();
    const tokenSymbol = await wasteVanToken.symbol();
    console.log(`Token: ${tokenName} (${tokenSymbol})`);

    // Test 2: Check minter permissions
    const isMinter = await wasteVanToken.minters(WASTE_VAN_ADDRESS);
    console.log(`WasteVan is authorized minter: ${isMinter}`);

    // Test 3: Check deployer agent status
    const agentStats = await wasteVan.getAgentStats(deployerAddress);
    console.log(`Deployer is agent: ${agentStats[0]}`);
    console.log(`Agent points: ${agentStats[1]}`);
    console.log(`Agent collections: ${agentStats[2]}`);

    // Test 4: Check token balance
    const balance = await wasteVanToken.balanceOf(deployerAddress);
    console.log(`Deployer token balance: ${hre.ethers.formatEther(balance)} WVT`);

    // Test 5: Check report counter
    const reportCounter = await wasteVan.reportCounter();
    console.log(`Total reports: ${reportCounter}`);

    console.log("\n=== Integration Test Results ===");
    
    if (!isMinter) {
      console.log("❌ CRITICAL: WasteVan contract is not authorized as minter!");
      console.log("   Run: npm run setup-minter");
    } else {
      console.log("✅ Minter permissions configured correctly");
    }

    if (!agentStats[0]) {
      console.log("❌ WARNING: Deployer is not registered as agent");
    } else {
      console.log("✅ Deployer is registered as agent");
    }

    console.log("✅ Contract integration test completed");

  } catch (error) {
    console.error("❌ Error during integration test:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
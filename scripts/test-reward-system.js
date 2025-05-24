const hre = require("hardhat");

async function main() {
  // Replace these with your deployed contract addresses
  const WASTE_VAN_TOKEN_ADDRESS = process.env.VITE_WASTE_VAN_TOKEN_ADDRESS;
  const WASTE_VAN_ADDRESS = process.env.VITE_WASTE_VAN_ADDRESS;

  if (!WASTE_VAN_TOKEN_ADDRESS || !WASTE_VAN_ADDRESS) {
    console.error("Please set VITE_WASTE_VAN_TOKEN_ADDRESS and VITE_WASTE_VAN_ADDRESS environment variables");
    process.exit(1);
  }

  console.log("Testing WasteVan reward system...");
  console.log("WasteVan Token Address:", WASTE_VAN_TOKEN_ADDRESS);
  console.log("WasteVan Address:", WASTE_VAN_ADDRESS);

  // Get contract instances
  const WasteVan = await hre.ethers.getContractFactory("WasteVan");
  const wasteVan = WasteVan.attach(WASTE_VAN_ADDRESS);

  const WasteVanToken = await hre.ethers.getContractFactory("WasteVanToken");
  const wasteVanToken = WasteVanToken.attach(WASTE_VAN_TOKEN_ADDRESS);

  // Get signers
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  
  console.log("\n=== Account Information ===");
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  try {
    // Check if deployer is registered as agent
    console.log("\n=== Checking Agent Status ===");
    const deployerAgentStats = await wasteVan.getAgentStats(deployer.address);
    console.log("Deployer is agent:", deployerAgentStats[0]);
    console.log("Deployer points:", deployerAgentStats[1].toString());
    console.log("Deployer collections:", deployerAgentStats[2].toString());

    // Check minter permissions
    console.log("\n=== Checking Minter Permissions ===");
    const isMinter = await wasteVanToken.minters(WASTE_VAN_ADDRESS);
    console.log("WasteVan contract is minter:", isMinter);

    // Register users
    console.log("\n=== Registering Users ===");
    try {
      const registerUser1Tx = await wasteVan.connect(user1).registerUser("TestUser1", "user1@test.com");
      await registerUser1Tx.wait();
      console.log("✅ User1 registered successfully");
    } catch (error) {
      console.log("User1 registration:", error.message);
    }

    try {
      const registerUser2Tx = await wasteVan.connect(user2).registerUser("TestUser2", "user2@test.com");
      await registerUser2Tx.wait();
      console.log("✅ User2 registered successfully");
    } catch (error) {
      console.log("User2 registration:", error.message);
    }

    // Report waste from users
    console.log("\n=== Reporting Waste ===");
    try {
      const reportTx1 = await wasteVan.connect(user1).reportWaste(
        "QmTestHash1", // IPFS hash
        5, // quantity
        "PET", // waste type
        "Test Location 1" // location
      );
      await reportTx1.wait();
      console.log("✅ User1 reported waste successfully");
    } catch (error) {
      console.log("User1 waste report error:", error.message);
    }

    try {
      const reportTx2 = await wasteVan.connect(user2).reportWaste(
        "QmTestHash2", // IPFS hash
        3, // quantity
        "HDPE", // waste type
        "Test Location 2" // location
      );
      await reportTx2.wait();
      console.log("✅ User2 reported waste successfully");
    } catch (error) {
      console.log("User2 waste report error:", error.message);
    }

    // Check report counter
    const reportCounter = await wasteVan.reportCounter();
    console.log("Total reports:", reportCounter.toString());

    // Get all reports
    console.log("\n=== Checking Waste Reports ===");
    for (let i = 1; i <= Number(reportCounter); i++) {
      try {
        const report = await wasteVan.getWasteReportDetails(i);
        console.log(`Report #${i}:`);
        console.log(`  Reporter: ${report[1]}`);
        console.log(`  Quantity: ${report[3]} kg`);
        console.log(`  Waste Type: ${report[4]}`);
        console.log(`  Location: ${report[5]}`);
        console.log(`  Is Collected: ${report[7]}`);
        console.log(`  Token Reward: ${report[9]} WVT`);
      } catch (error) {
        console.log(`Error getting report #${i}:`, error.message);
      }
    }

    // Collect waste as agent (deployer)
    console.log("\n=== Collecting Waste as Agent ===");
    for (let i = 1; i <= Number(reportCounter); i++) {
      try {
        const report = await wasteVan.getWasteReportDetails(i);
        if (!report[7]) { // if not collected
          console.log(`Collecting waste report #${i}...`);
          const collectTx = await wasteVan.connect(deployer).collectWaste(i);
          await collectTx.wait();
          console.log(`✅ Successfully collected waste report #${i}`);
        }
      } catch (error) {
        console.log(`Error collecting waste #${i}:`, error.message);
      }
    }

    // Check token balances
    console.log("\n=== Checking Token Balances ===");
    const deployerBalance = await wasteVanToken.balanceOf(deployer.address);
    const user1Balance = await wasteVanToken.balanceOf(user1.address);
    const user2Balance = await wasteVanToken.balanceOf(user2.address);

    console.log("Deployer balance:", hre.ethers.formatEther(deployerBalance), "WVT");
    console.log("User1 balance:", hre.ethers.formatEther(user1Balance), "WVT");
    console.log("User2 balance:", hre.ethers.formatEther(user2Balance), "WVT");

    // Check updated agent stats
    console.log("\n=== Updated Agent Stats ===");
    const updatedAgentStats = await wasteVan.getAgentStats(deployer.address);
    console.log("Deployer points:", updatedAgentStats[1].toString());
    console.log("Deployer collections:", updatedAgentStats[2].toString());

    console.log("\n✅ Reward system test completed successfully!");

  } catch (error) {
    console.error("❌ Error during testing:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

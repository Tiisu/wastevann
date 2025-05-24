const hre = require("hardhat");

async function main() {
  // Replace these with your deployed contract addresses
  const WASTE_VAN_TOKEN_ADDRESS = process.env.WASTE_VAN_TOKEN_ADDRESS;
  const WASTE_VAN_ADDRESS = process.env.WASTE_VAN_ADDRESS;

  if (!WASTE_VAN_TOKEN_ADDRESS || !WASTE_VAN_ADDRESS) {
    console.error("Please set WASTE_VAN_TOKEN_ADDRESS and WASTE_VAN_ADDRESS environment variables");
    process.exit(1);
  }

  console.log("Setting up minter permissions...");
  console.log("Token Address:", WASTE_VAN_TOKEN_ADDRESS);
  console.log("WasteVan Address:", WASTE_VAN_ADDRESS);

  // Get contract instances
  const WasteVanToken = await hre.ethers.getContractFactory("WasteVanToken");
  const wasteVanToken = WasteVanToken.attach(WASTE_VAN_TOKEN_ADDRESS);

  try {
    // Add WasteVan contract as a minter
    console.log("Adding WasteVan contract as minter...");
    const tx = await wasteVanToken.addMinter(WASTE_VAN_ADDRESS);
    await tx.wait();
    console.log("✅ WasteVan contract added as minter successfully!");

    // Verify the minter was added
    const isMinter = await wasteVanToken.minters(WASTE_VAN_ADDRESS);
    console.log("✅ Verification: WasteVan is minter:", isMinter);

  } catch (error) {
    console.error("❌ Error setting up minter permissions:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Deploy WasteVanToken
  console.log("Deploying WasteVanToken...");
  const WasteVanToken = await hre.ethers.getContractFactory("WasteVanToken");
  const wasteVanToken = await WasteVanToken.deploy();
  await wasteVanToken.waitForDeployment();
  const tokenAddress = await wasteVanToken.getAddress();
  console.log("WasteVanToken deployed to:", tokenAddress);

  // Deploy WasteVan
  console.log("Deploying WasteVan...");
  const WasteVan = await hre.ethers.getContractFactory("WasteVan");
  const wasteVan = await WasteVan.deploy(tokenAddress);
  await wasteVan.waitForDeployment();
  const wasteVanAddress = await wasteVan.getAddress();
  console.log("WasteVan deployed to:", wasteVanAddress);

  // Set up minter permissions
  console.log("Setting up minter permissions...");
  try {
    const addMinterTx = await wasteVanToken.addMinter(wasteVanAddress);
    await addMinterTx.wait();
    console.log("WasteVan contract added as minter successfully!");
  } catch (error) {
    console.log("Error setting up minter permissions:", error);
  }

  // Verify contracts on Etherscan (if not on a local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    // Wait for 6 block confirmations
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute

    console.log("Verifying WasteVanToken...");
    try {
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Error verifying WasteVanToken:", error);
    }

    console.log("Verifying WasteVan...");
    try {
      await hre.run("verify:verify", {
        address: wasteVanAddress,
        constructorArguments: [tokenAddress],
      });
    } catch (error) {
      console.log("Error verifying WasteVan:", error);
    }
  }

  console.log("Deployment completed!");
  console.log("WasteVanToken address:", tokenAddress);
  console.log("WasteVan address:", wasteVanAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
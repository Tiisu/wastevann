const hre = require("hardhat");

async function main() {
  // Replace these with your deployed contract addresses
  const WASTE_VAN_ADDRESS = process.env.WASTE_VAN_ADDRESS;

  if (!WASTE_VAN_ADDRESS) {
    console.error("Please set WASTE_VAN_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("Distributing tokens to existing agents...");
  console.log("WasteVan Address:", WASTE_VAN_ADDRESS);

  // Get contract instance
  const WasteVan = await hre.ethers.getContractFactory("WasteVan");
  const wasteVan = WasteVan.attach(WASTE_VAN_ADDRESS);

  // List of agent addresses that need tokens (replace with actual addresses)
  const agentAddresses = [
    // Add agent addresses here
    // "0x1234567890123456789012345678901234567890",
    // "0x0987654321098765432109876543210987654321",
  ];

  const tokensToDistribute = hre.ethers.parseEther("1000"); // 1000 tokens

  for (const agentAddress of agentAddresses) {
    try {
      console.log(`Distributing 1000 tokens to agent: ${agentAddress}`);
      
      // Check if the address is a verified agent
      const agentStats = await wasteVan.getAgentStats(agentAddress);
      if (!agentStats[0]) { // isVerified is the first element
        console.log(`❌ ${agentAddress} is not a verified agent, skipping...`);
        continue;
      }

      // Distribute tokens
      const tx = await wasteVan.distributeAgentTokens(agentAddress, tokensToDistribute);
      await tx.wait();
      console.log(`✅ Successfully distributed 1000 tokens to ${agentAddress}`);

    } catch (error) {
      console.error(`❌ Error distributing tokens to ${agentAddress}:`, error.message);
    }
  }

  console.log("Token distribution completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const fs = require('fs');
const path = require('path');

function verifyFrontendIntegration() {
  console.log("Verifying Frontend Integration...");
  
  // Check 1: Environment variables
  const envPath = path.join(__dirname, '../Frontend/.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasTokenAddress = envContent.includes('VITE_WASTE_VAN_TOKEN_ADDRESS');
    const hasWasteVanAddress = envContent.includes('VITE_WASTE_VAN_ADDRESS');
    const hasPinataKeys = envContent.includes('VITE_PINATA_API_KEY');
    
    console.log(`✅ Environment file exists`);
    console.log(`${hasTokenAddress ? '✅' : '❌'} Token address configured`);
    console.log(`${hasWasteVanAddress ? '✅' : '❌'} WasteVan address configured`);
    console.log(`${hasPinataKeys ? '✅' : '❌'} Pinata keys configured`);
  } else {
    console.log("❌ Frontend .env file not found");
  }

  // Check 2: Contract ABI files
  const abiDir = path.join(__dirname, '../Frontend/contractABI');
  const requiredABIs = ['WasteVan.json', 'WasteVanToken.json'];
  
  console.log("\n=== ABI Files ===");
  for (const abiFile of requiredABIs) {
    const abiPath = path.join(abiDir, abiFile);
    if (fs.existsSync(abiPath)) {
      const abiContent = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      const hasABI = abiContent.abi && abiContent.abi.length > 0;
      console.log(`${hasABI ? '✅' : '❌'} ${abiFile} - ${hasABI ? 'Valid' : 'Invalid'}`);
    } else {
      console.log(`❌ ${abiFile} - Missing`);
    }
  }

  // Check 3: Contract utilities
  const contractUtilsPath = path.join(__dirname, '../Frontend/src/utils/contracts.ts');
  if (fs.existsSync(contractUtilsPath)) {
    const utilsContent = fs.readFileSync(contractUtilsPath, 'utf8');
    const hasGetContract = utilsContent.includes('export const getContract');
    const hasReportWaste = utilsContent.includes('reportWasteWithLocation');
    const hasApproveWaste = utilsContent.includes('approveWaste');
    
    console.log("\n=== Contract Utils ===");
    console.log(`${hasGetContract ? '✅' : '❌'} getContract function`);
    console.log(`${hasReportWaste ? '✅' : '❌'} reportWasteWithLocation function`);
    console.log(`${hasApproveWaste ? '✅' : '❌'} approveWaste function`);
  } else {
    console.log("❌ Contract utilities file not found");
  }

  // Check 4: Context provider
  const contextPath = path.join(__dirname, '../Frontend/src/context/ContractContext.tsx');
  if (fs.existsSync(contextPath)) {
    const contextContent = fs.readFileSync(contextPath, 'utf8');
    const hasProvider = contextContent.includes('ContractProvider');
    const hasUseContract = contextContent.includes('useContract');
    
    console.log("\n=== Context Provider ===");
    console.log(`${hasProvider ? '✅' : '❌'} ContractProvider component`);
    console.log(`${hasUseContract ? '✅' : '❌'} useContract hook`);
  } else {
    console.log("❌ Contract context file not found");
  }

  console.log("\n=== Frontend Integration Verification Complete ===");
}

verifyFrontendIntegration();
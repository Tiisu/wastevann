const fs = require('fs-extra');
const path = require('path');

async function copyArtifacts() {
  try {
    const sourceDir = path.join(__dirname, '../artifacts/contracts');
    const targetDir = path.join(__dirname, '../Frontend/contractABI');

    // Ensure the target directory exists
    fs.ensureDirSync(targetDir);

    // Copy specific contract artifacts
    const contracts = ['WasteVan', 'WasteVanToken', 'Lock'];
    
    for (const contractName of contracts) {
      const sourceFile = path.join(sourceDir, `${contractName}.sol`, `${contractName}.json`);
      const targetFile = path.join(targetDir, `${contractName}.json`);
      
      if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied ${contractName}.json`);
      } else {
        console.log(`${contractName}.json not found at ${sourceFile}`);
      }
    }

    console.log('Contract artifacts copied successfully!');
  } catch (error) {
    console.error('Error copying artifacts:', error);
  }
}

copyArtifacts();
const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../artifacts/contracts');
const targetDir = path.join(__dirname, '../frontend/src/artifacts/contracts');

// Ensure the target directory exists
fs.ensureDirSync(targetDir);

// Copy the contract artifacts
fs.copySync(sourceDir, targetDir, {
  filter: (src) => {
    // Only copy .json files
    return src.endsWith('.json');
  }
});

console.log('Contract artifacts copied successfully!'); 
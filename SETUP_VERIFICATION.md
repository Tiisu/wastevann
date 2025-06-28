# WasteVan Setup Verification Checklist

## Quick Verification Steps

### 1. Check Contract Addresses
Verify that the following addresses are correctly set in `Frontend/.env`:

```env
VITE_WASTE_VAN_TOKEN_ADDRESS=0x5257C0710C6f9A0320cEdD4a95f895caCE29F42C
VITE_WASTE_VAN_ADDRESS=0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0
```

### 2. Verify Contract ABIs
Check that these files exist and contain valid JSON:
- `Frontend/contractABI/WasteVan.json`
- `Frontend/contractABI/WasteVanToken.json`

### 3. Test Contract Functions
Open browser console on the frontend and test:

```javascript
// Test contract connection
const { wasteVan, wasteVanToken } = await window.getContract();
console.log("Token name:", await wasteVanToken.name());
console.log("Report counter:", await wasteVan.reportCounter());
```

### 4. Verify Minter Permissions
In browser console:

```javascript
const { wasteVanToken } = await window.getContract();
const wasteVanAddress = "0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0";
const isMinter = await wasteVanToken.minters(wasteVanAddress);
console.log("WasteVan is minter:", isMinter);
```

### 5. Check Agent Status
```javascript
const { wasteVan } = await window.getContract();
const deployerAddress = "YOUR_DEPLOYER_ADDRESS";
const agentStats = await wasteVan.getAgentStats(deployerAddress);
console.log("Is agent:", agentStats[0]);
console.log("Points:", agentStats[1].toString());
```

## Manual Testing Flow

### 1. User Registration
1. Connect MetaMask to Sepolia testnet
2. Navigate to registration page
3. Enter username and email
4. Submit registration transaction
5. Verify success message

### 2. Waste Reporting
1. Navigate to "Report Waste" page
2. Upload an image (max 5MB)
3. Enter quantity (kg)
4. Select waste type
5. Get current location or enter manually
6. Submit report
7. Verify QR code generation
8. Check transaction on Sepolia Etherscan

### 3. Agent Dashboard
1. Switch to agent mode (if deployer)
2. Navigate to agent dashboard
3. Verify pending reports are visible
4. Test approve/reject functionality
5. Check token distribution to users

## Expected Behavior

### ✅ Successful Integration Indicators
- MetaMask connects without errors
- User registration completes successfully
- Waste reports submit to blockchain
- IPFS images upload correctly
- QR codes generate properly
- Agent dashboard shows real-time data
- Token rewards distribute automatically
- Transaction confirmations appear

### ❌ Common Issues to Watch For
- "User not registered" errors
- "Token minting failed" messages
- IPFS upload failures
- Network mismatch warnings
- Missing contract addresses
- Invalid ABI errors

## Troubleshooting Commands

If you encounter issues, try these steps:

### Reset Environment
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend dependencies
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

### Recompile and Copy Artifacts
```bash
# Recompile contracts (if Node.js works)
npm run compile

# Manually copy artifacts
cp artifacts/contracts/WasteVan.sol/WasteVan.json Frontend/contractABI/
cp artifacts/contracts/WasteVanToken.sol/WasteVanToken.json Frontend/contractABI/
```

### Verify Network Configuration
1. Check MetaMask is on Sepolia testnet
2. Verify you have Sepolia ETH for gas fees
3. Confirm contract addresses are correct
4. Test with a different wallet address

## Success Criteria

The integration is working correctly when:

1. ✅ Users can register without errors
2. ✅ Waste reports submit to blockchain successfully
3. ✅ Images upload to IPFS via Pinata
4. ✅ QR codes generate with correct data
5. ✅ Agent dashboard displays real-time blockchain data
6. ✅ Waste approval mints tokens to users
7. ✅ Token balances update correctly
8. ✅ All transactions confirm on Sepolia Etherscan

## Next Steps After Verification

Once verification is complete:

1. **User Testing**: Invite test users to try the full flow
2. **Performance Monitoring**: Monitor gas costs and transaction times
3. **Security Review**: Audit smart contracts for production
4. **Documentation**: Create user guides and tutorials
5. **Mainnet Planning**: Prepare for mainnet deployment strategy

## Support Resources

- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Pinata IPFS**: https://pinata.cloud/
- **MetaMask Support**: https://support.metamask.io/

---

**Last Updated**: Current deployment on Sepolia testnet
**Contract Versions**: Latest with fixed reward system
**Status**: Ready for testing and production use
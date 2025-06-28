# WasteVan Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Node.js (v16+) installed
- [ ] Project dependencies installed (`npm install`)
- [ ] MetaMask wallet configured with Sepolia testnet
- [ ] Testnet ETH obtained (minimum 0.01 ETH recommended)

### ✅ API Keys & Configuration
- [ ] Alchemy account created and API key obtained
- [ ] `.env` file created with required variables:
  - [ ] `ALCHEMY_API_KEY`
  - [ ] `PRIVATE_KEY`
  - [ ] `ETHERSCAN_API_KEY` (optional)
- [ ] Pinata account created for IPFS (for frontend)

### ✅ Pre-Deployment Verification
- [ ] Wallet has sufficient ETH balance
- [ ] Network connection working

## Deployment Process

### ✅ Smart Contract Deployment
- [ ] Run `npm run compile` - compilation successful
- [ ] Run `npm run deploy` - deployment successful
- [ ] Note deployed contract addresses:
  - [ ] WasteVanToken: `_________________`
  - [ ] WasteVan: `_________________`
- [ ] Deployment completed successfully

### ✅ Frontend Configuration
- [ ] Create `Frontend/.env` with:
  - [ ] `VITE_WASTE_VAN_TOKEN_ADDRESS`
  - [ ] `VITE_WASTE_VAN_ADDRESS`
  - [ ] `VITE_PINATA_API_KEY`
  - [ ] `VITE_PINATA_SECRET_KEY`
  - [ ] `VITE_PINATA_JWT`
- [ ] Run `npm run frontend:install`
- [ ] Run `npm run frontend:build` - build successful

## Post-Deployment Testing

### ✅ Smart Contract Testing
- [ ] Run `npm run test-rewards` - all tests pass
- [ ] Deployer is registered as agent
- [ ] Token minting permissions set correctly
- [ ] Contract verification on Etherscan (if enabled)

### ✅ Frontend Testing
- [ ] Run `npm run frontend:dev`
- [ ] Application loads at `http://localhost:5173`
- [ ] MetaMask connection works
- [ ] User registration works
- [ ] Waste reporting works
- [ ] Agent dashboard accessible
- [ ] QR code generation/scanning works

### ✅ End-to-End Testing
- [ ] Register as a user
- [ ] Create a waste report with image upload
- [ ] Switch to agent mode
- [ ] Verify waste collection
- [ ] Check token rewards distributed
- [ ] Verify transaction on Sepolia Etherscan

## Production Readiness

### ✅ Security Review
- [ ] Private keys secured and not committed to git
- [ ] Environment variables properly configured
- [ ] Smart contracts reviewed for security issues
- [ ] Frontend security best practices followed

### ✅ Documentation
- [ ] Deployment addresses documented
- [ ] User guide created
- [ ] API documentation updated
- [ ] Troubleshooting guide available

### ✅ Monitoring & Maintenance
- [ ] Contract addresses saved securely
- [ ] Backup of deployment configuration
- [ ] Monitoring setup for contract events
- [ ] Update procedures documented

## Troubleshooting Common Issues

### Deployment Fails
- [ ] Check ETH balance sufficient for gas
- [ ] Verify Alchemy API key is correct
- [ ] Ensure private key is valid (without 0x prefix)
- [ ] Check network connectivity

### Frontend Issues
- [ ] Verify contract addresses in Frontend/.env
- [ ] Check Pinata API keys
- [ ] Ensure MetaMask is on Sepolia testnet
- [ ] Clear browser cache and reload

### Contract Interaction Issues
- [ ] Verify contract is deployed correctly
- [ ] Check minter permissions are set
- [ ] Ensure deployer is registered as agent
- [ ] Verify token contract is linked properly

## Success Criteria

✅ **Deployment Successful When:**
- All smart contracts deployed and verified
- Frontend builds and runs without errors
- User registration and waste reporting work
- Agent verification and token distribution work
- All tests pass
- Documentation is complete

## Next Steps After Successful Deployment

1. **User Onboarding**: Create user guides and tutorials
2. **Community Building**: Engage with potential users and agents
3. **Feature Enhancement**: Plan additional features based on feedback
4. **Security Audit**: Consider professional security audit for production
5. **Mainnet Planning**: Prepare for mainnet deployment strategy

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Network**: Sepolia Testnet
**Status**: ⏳ In Progress / ✅ Complete / ❌ Failed
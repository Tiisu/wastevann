import { ethers } from 'ethers';
import WasteVanABI from '../../contractABI/WasteVan.json';
import WasteVanTokenABI from '../../contractABI/WasteVanToken.json';

// Contract addresses from environment
const WASTE_VAN_TOKEN_ADDRESS = import.meta.env.VITE_WASTE_VAN_TOKEN_ADDRESS;
const WASTE_VAN_ADDRESS = import.meta.env.VITE_WASTE_VAN_ADDRESS;

export const verifyContractSetup = async () => {
  const results: any = {};

  try {
    // Check environment variables
    results.envVars = {
      tokenAddress: WASTE_VAN_TOKEN_ADDRESS,
      wasteVanAddress: WASTE_VAN_ADDRESS,
      hasTokenAddress: !!WASTE_VAN_TOKEN_ADDRESS,
      hasWasteVanAddress: !!WASTE_VAN_ADDRESS
    };

    // Check ABI files
    results.abis = {
      wasteVanABI: !!WasteVanABI.abi,
      wasteVanTokenABI: !!WasteVanTokenABI.abi,
      wasteVanFunctions: WasteVanABI.abi ? WasteVanABI.abi.filter((item: any) => item.type === 'function').length : 0,
      tokenFunctions: WasteVanTokenABI.abi ? WasteVanTokenABI.abi.filter((item: any) => item.type === 'function').length : 0
    };

    // Check if MetaMask is available
    results.wallet = {
      hasMetaMask: typeof window.ethereum !== 'undefined',
      isConnected: false
    };

    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        results.wallet.isConnected = accounts.length > 0;
        
        if (accounts.length > 0) {
          results.wallet.currentAccount = accounts[0].address;
          
          // Check network
          const network = await provider.getNetwork();
          results.network = {
            chainId: Number(network.chainId),
            name: network.name,
            isSepoliaTestnet: Number(network.chainId) === 11155111
          };

          // Try to create contract instances
          if (WASTE_VAN_TOKEN_ADDRESS && WASTE_VAN_ADDRESS) {
            try {
              const signer = await provider.getSigner();
              
              const wasteVanToken = new ethers.Contract(
                WASTE_VAN_TOKEN_ADDRESS,
                WasteVanTokenABI.abi,
                signer
              );
              
              const wasteVan = new ethers.Contract(
                WASTE_VAN_ADDRESS,
                WasteVanABI.abi,
                signer
              );

              // Test basic contract calls
              results.contractTests = {
                tokenName: await wasteVanToken.name(),
                tokenSymbol: await wasteVanToken.symbol(),
                reportCounter: await wasteVan.reportCounter(),
                contractsWorking: true
              };
            } catch (contractError) {
              results.contractTests = {
                error: contractError.message,
                contractsWorking: false
              };
            }
          }
        }
      } catch (walletError) {
        results.wallet.error = walletError.message;
      }
    }

    return results;
  } catch (error) {
    return {
      error: error.message,
      results
    };
  }
};

export const getContractAddresses = () => {
  return {
    tokenAddress: WASTE_VAN_TOKEN_ADDRESS,
    wasteVanAddress: WASTE_VAN_ADDRESS
  };
};
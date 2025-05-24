import { ethers } from 'ethers';
import { toast } from 'sonner';

// Import contract ABIs from the contractABI folder
import WasteVanABI from '../../contractABI/WasteVan.json';
import WasteVanTokenABI from '../../contractABI/WasteVanToken.json';

// Contract addresses - these should be updated with your deployed contract addresses
// You can set these as environment variables in a .env file
const WASTE_VAN_TOKEN_ADDRESS = import.meta.env.VITE_WASTE_VAN_TOKEN_ADDRESS;
const WASTE_VAN_ADDRESS = import.meta.env.VITE_WASTE_VAN_ADDRESS;

export const getContract = async () => {
  if (typeof window.ethereum === 'undefined') {
    toast.error('Please install MetaMask to interact with the blockchain');
    throw new Error('Please install MetaMask');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    // Sepolia testnet chainId is 11155111
    // You can modify this to check for your target network
    if (chainId !== 11155111 && chainId !== 1337 && chainId !== 31337) {
      toast.warning('Please switch to Sepolia testnet to use this application');
    }

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

    return { wasteVanToken, wasteVan, signer, provider };
  } catch (error) {
    console.error('Error getting contracts:', error);
    toast.error('Failed to connect to blockchain. Please check your wallet connection.');
    throw error;
  }
};

export const registerUser = async (username: string, email: string) => {
  try {
    toast.loading('Registering user...');
    const { wasteVan } = await getContract();
    const tx = await wasteVan.registerUser(username, email);
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('User registered successfully!');
    return tx;
  } catch (error) {
    console.error('Error registering user:', error);
    toast.error('Failed to register user. Please try again.');
    throw error;
  }
};

export const registerAgent = async () => {
  try {
    toast.loading('Registering as agent...');
    const { wasteVan } = await getContract();
    const tx = await wasteVan.registerAgent();
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('Registered as agent successfully! If token minting is enabled, you should receive 1000 WVT tokens.');
    return tx;
  } catch (error) {
    console.error('Error registering as agent:', error);
    toast.error('Failed to register as agent. Please try again.');
    throw error;
  }
};

export const reportWasteWithLocation = async (ipfsHash: string, quantity: number, wasteType: string, location: string) => {
  try {
    toast.loading('Submitting waste report...');
    const { wasteVan } = await getContract();

    // Log the parameters being sent to the contract
    console.log('Reporting waste with parameters:');
    console.log('IPFS Hash:', ipfsHash);
    console.log('Quantity:', quantity);
    console.log('Waste Type:', wasteType);
    console.log('Location:', location);

    const tx = await wasteVan.reportWaste(ipfsHash, quantity, wasteType, location);
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('Waste reported successfully!');
    return tx;
  } catch (error) {
    console.error('Error reporting waste:', error);
    // Provide more detailed error information
    if (error.message && error.message.includes('User not registered')) {
      toast.error('You need to register before reporting waste. Please register first.');
    } else {
      toast.error('Failed to report waste. Please try again.');
    }
    throw error;
  }
};

// Keep the old function for backward compatibility
export const reportWaste = async (ipfsHash: string, quantity: number, wasteType: string) => {
  // Default location if not provided
  const defaultLocation = "0, 0";
  return reportWasteWithLocation(ipfsHash, quantity, wasteType, defaultLocation);
};

export const approveWaste = async (reportId: number) => {
  try {
    toast.loading('Approving waste...');
    const { wasteVan } = await getContract();
    const tx = await wasteVan.approveWaste(reportId);
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('Waste approved successfully!');
    return tx;
  } catch (error) {
    console.error('Error approving waste:', error);
    toast.error('Failed to approve waste. Please try again.');
    throw error;
  }
};

export const rejectWaste = async (reportId: number, reason: string) => {
  try {
    toast.loading('Rejecting waste...');
    const { wasteVan } = await getContract();
    const tx = await wasteVan.rejectWaste(reportId, reason);
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('Waste rejected successfully!');
    return tx;
  } catch (error) {
    console.error('Error rejecting waste:', error);
    toast.error('Failed to reject waste. Please try again.');
    throw error;
  }
};

export const collectWaste = async (reportId: number) => {
  try {
    toast.loading('Collecting waste...');
    const { wasteVan } = await getContract();
    const tx = await wasteVan.collectWaste(reportId);
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success('Waste collected successfully!');
    return tx;
  } catch (error) {
    console.error('Error collecting waste:', error);
    toast.error('Failed to collect waste. Please try again.');
    throw error;
  }
};

export const purchasePoints = async (amount: string) => {
  try {
    toast.loading(`Purchasing points...`);
    const { wasteVan } = await getContract();
    const tx = await wasteVan.purchasePoints({ value: ethers.parseEther(amount) });
    toast.loading(`Transaction submitted. Waiting for confirmation...`);
    await tx.wait();
    toast.success(`Successfully purchased points!`);
    return tx;
  } catch (error) {
    console.error('Error purchasing points:', error);
    toast.error('Failed to purchase points. Please try again.');
    throw error;
  }
};

export const getUserStats = async (address: string) => {
  try {
    const { wasteVan } = await getContract();
    return await wasteVan.getUserStats(address);
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

export const getAgentStats = async (address: string) => {
  try {
    const { wasteVan } = await getContract();
    return await wasteVan.getAgentStats(address);
  } catch (error) {
    console.error('Error getting agent stats:', error);
    return null;
  }
};

export const getWasteReport = async (reportId: number) => {
  try {
    const { wasteVan } = await getContract();
    return await wasteVan.getWasteReport(reportId);
  } catch (error) {
    console.error(`Error getting waste report #${reportId}:`, error);
    return null;
  }
};

export const getWasteReportDetails = async (reportId: number) => {
  try {
    const { wasteVan } = await getContract();
    return await wasteVan.getWasteReportDetails(reportId);
  } catch (error) {
    console.error(`Error getting waste report details #${reportId}:`, error);
    return null;
  }
};

export const getTokenBalance = async (address: string) => {
  try {
    const { wasteVanToken } = await getContract();
    return await wasteVanToken.balanceOf(address);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return ethers.parseEther('0');
  }
};

// Get all waste reports for a user
export const getUserWasteReports = async (address: string) => {
  try {
    const { wasteVan } = await getContract();
    const reportCount = await wasteVan.reportCounter();

    // Convert BigInt to number for iteration
    const count = Number(reportCount);
    console.log(`Total waste reports in contract: ${count}`);

    const reports = [];
    // Fetch reports in batches to avoid too many concurrent requests
    const batchSize = 10;

    for (let i = 1; i <= count; i += batchSize) {
      const promises = [];

      // Create a batch of promises
      for (let j = i; j < i + batchSize && j <= count; j++) {
        promises.push(
          (async () => {
            try {
              const report = await wasteVan.wasteReports(j);
              if (report.reporter.toLowerCase() === address.toLowerCase()) {
                // Get additional details for this report
                const fullReport = {
                  reportId: j,
                  reporter: report.reporter,
                  ipfsHash: report.ipfsHash,
                  quantity: Number(report.quantity),
                  wasteType: report.wasteType,
                  location: report.location,
                  timestamp: Number(report.timestamp) * 1000, // Convert to milliseconds
                  isCollected: report.isCollected,
                  collectedBy: report.collectedBy,
                  tokenReward: report.tokenReward, // Keep as BigInt for proper conversion
                  status: Number(report.status), // 0: Pending, 1: Approved, 2: Rejected
                  rejectionReason: report.rejectionReason || ""
                };
                return fullReport;
              }
              return null;
            } catch (error) {
              console.error(`Error fetching report #${j}:`, error);
              return null;
            }
          })()
        );
      }

      // Wait for all promises in this batch
      const batchResults = await Promise.all(promises);

      // Filter out null results and add to reports array
      reports.push(...batchResults.filter(report => report !== null));
    }

    console.log(`Found ${reports.length} waste reports for address ${address}`);
    return reports;
  } catch (error) {
    console.error('Error getting user waste reports:', error);
    return [];
  }
};

// Get all waste reports (for agent dashboard)
export const getAllWasteReports = async () => {
  try {
    const { wasteVan } = await getContract();
    const reportCount = await wasteVan.reportCounter();

    // Convert BigInt to number for iteration
    const count = Number(reportCount);
    console.log(`Total waste reports in contract: ${count}`);

    const reports = [];
    // Fetch reports in batches to avoid too many concurrent requests
    const batchSize = 10;

    for (let i = 1; i <= count; i += batchSize) {
      const promises = [];

      // Create a batch of promises
      for (let j = i; j < i + batchSize && j <= count; j++) {
        promises.push(
          (async () => {
            try {
              const report = await wasteVan.wasteReports(j);
              // Get additional details for this report
              const fullReport = {
                reportId: j,
                reporter: report.reporter,
                ipfsHash: report.ipfsHash,
                quantity: Number(report.quantity),
                wasteType: report.wasteType,
                location: report.location,
                timestamp: Number(report.timestamp) * 1000, // Convert to milliseconds
                isCollected: report.isCollected,
                collectedBy: report.collectedBy,
                tokenReward: report.tokenReward, // Keep as BigInt for proper conversion
                status: Number(report.status), // 0: Pending, 1: Approved, 2: Rejected
                rejectionReason: report.rejectionReason || ""
              };
              return fullReport;
            } catch (error) {
              console.error(`Error fetching report #${j}:`, error);
              return null;
            }
          })()
        );
      }

      // Wait for all promises in this batch
      const batchResults = await Promise.all(promises);

      // Filter out null results and add to reports array
      reports.push(...batchResults.filter(report => report !== null));
    }

    console.log(`Found ${reports.length} total waste reports`);
    return reports;
  } catch (error) {
    console.error('Error getting all waste reports:', error);
    return [];
  }
};

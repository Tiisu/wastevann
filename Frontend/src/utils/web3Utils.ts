
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Mock ABI for the WasteVan smart contract
const WASTEVAN_ABI = [
  // These would be actual contract functions in a real implementation
  "function reportWaste(uint8 wasteType, uint256 quantity, string location) public returns (uint256)",
  "function getRewardEstimate(uint8 wasteType, uint256 quantity) public view returns (uint256)",
  "function getWasteReports(address agent) public view returns (uint256[])",
  "function verifyWasteCollection(uint256 reportId) public",
  "function getTokenBalance(address user) public view returns (uint256)",
  "function getStats() public view returns (uint256 totalWaste, uint256 totalTokens, uint256 totalUsers)"
];

// This would be the actual contract address in a production environment
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum PlasticType {
  PET = 0, // Polyethylene terephthalate
  HDPE = 1, // High-density polyethylene
  PVC = 2, // Polyvinyl chloride
  LDPE = 3, // Low-density polyethylene
  PP = 4, // Polypropylene
  PS = 5, // Polystyrene
  OTHER = 6 // Other plastics
}

export interface WasteReport {
  id: number;
  plasticType: PlasticType;
  quantity: number;
  location: string;
  timestamp: number;
  rewardEstimate: number;
  reporter: string;
  status: 'pending' | 'collected' | 'verified' | 'rejected';
  ipfsHash?: string; // IPFS hash for the waste image
  rejectionReason?: string; // Reason for rejection if applicable
}

// Mock waste reports for demonstration
export const mockWasteReports: WasteReport[] = [
  {
    id: 1,
    plasticType: PlasticType.PET,
    quantity: 5,
    location: "52.3676, 4.9041",
    timestamp: Date.now() - 3600000, // 1 hour ago
    rewardEstimate: 10,
    reporter: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: 'pending'
  },
  {
    id: 2,
    plasticType: PlasticType.HDPE,
    quantity: 3,
    location: "52.3680, 4.9030",
    timestamp: Date.now() - 7200000, // 2 hours ago
    rewardEstimate: 6,
    reporter: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: 'pending'
  },
  {
    id: 3,
    plasticType: PlasticType.PP,
    quantity: 8,
    location: "52.3700, 4.9050",
    timestamp: Date.now() - 10800000, // 3 hours ago
    rewardEstimate: 16,
    reporter: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    status: 'collected'
  }
];

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      toast.error("MetaMask not found. Please install MetaMask.");
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setAccount(address);
      toast.success("Wallet connected successfully!");
    } catch (err) {
      console.error("Error connecting wallet:", err);
      toast.error("Failed to connect wallet. Please try again.");
      setError("Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    setProvider(null);
    setAccount(null);
    toast.info("Wallet disconnected");
  }

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setProvider(provider);
          setAccount(accounts[0].address);
        }
      }).catch(err => {
        console.error("Error checking wallet connection:", err);
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setProvider(null);
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return { account, provider, connectWallet, disconnectWallet, isConnecting, error };
}

export function getContract(provider: ethers.BrowserProvider | null) {
  if (!provider) return null;

  return new ethers.Contract(CONTRACT_ADDRESS, WASTEVAN_ABI, provider);
}

export async function getWasteStats() {
  try {
    // Import the proper contract functions and ethers
    const { getAllWasteReports } = await import('./contracts');
    const { ethers } = await import('ethers');

    // Get all waste reports from the blockchain
    const reports = await getAllWasteReports();

    // Calculate total waste collected and tokens distributed
    let totalWaste = 0;
    let totalTokensBigInt = BigInt(0);
    let uniqueUsers = new Set();

    // Loop through all reports to calculate stats
    reports.forEach(report => {
      totalWaste += Number(report.quantity.toString());
      // Convert tokenReward from wei to ether and add to total
      if (report.tokenReward) {
        totalTokensBigInt += BigInt(report.tokenReward.toString());
      }
      uniqueUsers.add(report.reporter.toLowerCase());
    });

    // Convert total tokens from wei to ether
    const totalTokens = Number(ethers.formatEther(totalTokensBigInt));

    // Calculate environmental impact (simplified calculation)
    // Assuming 1kg of plastic waste = 3kg of CO2 emissions prevented
    const co2Prevented = totalWaste * 3;

    console.log('Waste stats calculated:', {
      totalWaste,
      totalTokensBigInt: totalTokensBigInt.toString(),
      totalTokens,
      uniqueUsers: uniqueUsers.size
    });

    return {
      totalWasteCollected: totalWaste,
      totalTokensDistributed: totalTokens,
      activeUsers: uniqueUsers.size,
      impactMetric: `Prevented ${(co2Prevented / 1000).toFixed(2)} tons of CO2 emissions`
    };
  } catch (error) {
    console.error('Error fetching waste stats:', error);
    // Return mock data as fallback
    return {
      totalWasteCollected: 12450, // kg
      totalTokensDistributed: 24900,
      activeUsers: 532,
      impactMetric: "Prevented 37.35 tons of CO2 emissions"
    };
  }
}

export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}


import React from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export enum PlasticType {
  PET = 0,   // Polyethylene terephthalate
  HDPE = 1,  // High-density polyethylene
  PVC = 2,   // Polyvinyl chloride
  LDPE = 3,  // Low-density polyethylene
  PP = 4,    // Polypropylene
  PS = 5,    // Polystyrene
  OTHER = 6  // Other plastics
}

// For TypeScript to recognize window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WasteReport {
  id: string;
  type: PlasticType;
  weight: number;
  location: string;
  timestamp: number;
  status: 'pending' | 'verified' | 'collected';
  reporter: string;
}

interface TokenTransaction {
  id: string;
  amount: number;
  timestamp: number;
  type: 'reward' | 'transfer' | 'stake';
  description: string;
}

interface WalletState {
  account: string | null;
  balance: string;
  transactions: TokenTransaction[];
  isConnecting: boolean;
}

// Initial mock data for the wallet
const initialWalletState: WalletState = {
  account: null,
  balance: '0',
  transactions: [],
  isConnecting: false,
};

// Sample waste reports data
export const sampleWasteReports: WasteReport[] = [
  {
    id: '00001',
    type: PlasticType.PET,
    weight: 5.2,
    location: 'Vancouver Downtown',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'pending',
    reporter: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  },
  {
    id: '00002',
    type: PlasticType.HDPE,
    weight: 3.7,
    location: 'Kitsilano Beach',
    timestamp: Date.now() - 172800000, // 2 days ago
    status: 'verified',
    reporter: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    id: '00003',
    type: PlasticType.PVC,
    weight: 2.1,
    location: 'Stanley Park',
    timestamp: Date.now() - 259200000, // 3 days ago
    status: 'collected',
    reporter: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  },
];

// Connect to MetaMask wallet
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this feature');
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    toast.success('Wallet connected successfully');
    return address;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    toast.error('Failed to connect wallet');
    return null;
  }
};

// Disconnect from MetaMask wallet
export const disconnectWallet = async (): Promise<void> => {
  // Note: There's no standard way to "disconnect" in ethers.js
  // Usually we just clear the local state
  toast.success('Wallet disconnected');
};

// Format Ethereum address for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// React hook for wallet functionality
export const useWallet = () => {
  const [state, setState] = React.useState<WalletState>(initialWalletState);

  // Check if already connected
  React.useEffect(() => {
    if (window.ethereum) {
      const checkConnection = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const address = accounts[0].address;
            setState(prev => ({ ...prev, account: address }));
            loadWalletData(address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      };
      checkConnection();
    }
  }, []);

  // Load wallet data (balance and transactions)
  const loadWalletData = async (address: string) => {
    try {
      // In a real app, we would fetch this data from the blockchain
      // For now, we'll use mock data
      setState(prev => ({
        ...prev,
        balance: '25.75',
        transactions: [
          {
            id: 'tx001',
            amount: 10.5,
            timestamp: Date.now() - 86400000,
            type: 'reward',
            description: 'Reward for waste report #00001'
          },
          {
            id: 'tx002',
            amount: 7.25,
            timestamp: Date.now() - 172800000,
            type: 'reward',
            description: 'Reward for waste report #00002'
          },
          {
            id: 'tx003',
            amount: 8.0,
            timestamp: Date.now() - 259200000,
            type: 'reward',
            description: 'Reward for waste report #00003'
          }
        ]
      }));
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const connectWalletHandler = async () => {
    setState(prev => ({ ...prev, isConnecting: true }));
    try {
      const address = await connectWallet();
      if (address) {
        setState(prev => ({ ...prev, account: address }));
        loadWalletData(address);
      }
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWalletHandler = async () => {
    await disconnectWallet();
    setState(initialWalletState);
  };

  return {
    ...state,
    connectWallet: connectWalletHandler,
    disconnectWallet: disconnectWalletHandler
  };
};

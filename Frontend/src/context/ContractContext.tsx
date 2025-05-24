import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as contracts from '../utils/contracts';
import { toast } from 'sonner';

interface ContractContextType {
  account: string | null;
  isUser: boolean;
  isAgent: boolean;
  needsRegistration: boolean;
  userStats: any;
  agentStats: any;
  tokenBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  registerUser: (username: string, email: string) => Promise<void>;
  registerAgent: () => Promise<void>;
  reportWaste: (ipfsHash: string, quantity: number, wasteType: string) => Promise<void>;
  collectWaste: (reportId: number) => Promise<void>;
  approveWaste: (reportId: number) => Promise<void>;
  rejectWaste: (reportId: number, reason: string) => Promise<void>;
  purchasePoints: (amount: string) => Promise<void>;
  refreshTokenBalance: () => Promise<void>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isUser, setIsUser] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [agentStats, setAgentStats] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState('0');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask');
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      setAccount(userAddress);

      let userRegistered = false;
      let agentRegistered = false;

      try {
        // Check if user is registered
        const stats = await contracts.getUserStats(userAddress);
        console.log('Raw user stats from contract:', stats);
        userRegistered = !!(stats && stats.username && stats.username.length > 0);
        console.log('User registration status:', { userRegistered, stats });
        setIsUser(userRegistered);
        setUserStats(stats);
      } catch (error) {
        console.log('User not registered yet or contract call failed:', error);
        setIsUser(false);
        userRegistered = false;
      }

      try {
        // Check if user is an agent
        const agentStats = await contracts.getAgentStats(userAddress);
        console.log('Raw agent stats from contract:', agentStats);
        agentRegistered = !!(agentStats && agentStats.isVerified);
        console.log('Agent registration status:', { agentRegistered, agentStats });
        setIsAgent(agentRegistered);
        setAgentStats(agentStats);
      } catch (error) {
        console.log('Not an agent or contract call failed:', error);
        setIsAgent(false);
        agentRegistered = false;
      }

      try {
        // Get token balance
        const balance = await contracts.getTokenBalance(userAddress);
        setTokenBalance(ethers.formatEther(balance));
      } catch (error) {
        console.log('Error getting token balance:', error);
        setTokenBalance('0');
      }

      // Set needsRegistration if the user is not registered as either a user or an agent
      const needsReg = !userRegistered && !agentRegistered;
      console.log('ContractContext connectWallet:', {
        userAddress,
        userRegistered,
        agentRegistered,
        needsReg
      });
      setNeedsRegistration(needsReg);

      // Redirect to registration page if needed
      if (needsReg) {
        console.log('User needs registration, showing toast...');
        toast.info('Please complete your registration');
        // We'll handle the redirect in the ConnectWalletButton component

        // Also trigger a custom event for additional handling
        window.dispatchEvent(new CustomEvent('needsRegistration', {
          detail: { address: userAddress, needsRegistration: true }
        }));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const handleRegisterUser = async (username: string, email: string) => {
    try {
      await contracts.registerUser(username, email);
      setIsUser(true);
      setNeedsRegistration(false);

      // Refresh user stats
      if (account) {
        const stats = await contracts.getUserStats(account);
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const handleRegisterAgent = async () => {
    try {
      await contracts.registerAgent();
      setIsAgent(true);
      setNeedsRegistration(false);

      // Refresh agent stats and token balance (agents get 1000 WVT bonus)
      if (account) {
        const stats = await contracts.getAgentStats(account);
        setAgentStats(stats);

        // Refresh token balance as agents receive 1000 WVT bonus
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Error registering agent:', error);
      throw error;
    }
  };

  const handleReportWaste = async (ipfsHash: string, quantity: number, wasteType: string) => {
    try {
      await contracts.reportWaste(ipfsHash, quantity, wasteType);
      // Refresh user stats
      if (account) {
        const stats = await contracts.getUserStats(account);
        setUserStats(stats);

        // Refresh token balance
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Error reporting waste:', error);
      throw error;
    }
  };

  const handleCollectWaste = async (reportId: number) => {
    try {
      await contracts.collectWaste(reportId);
      // Refresh agent stats and token balance
      if (account) {
        const stats = await contracts.getAgentStats(account);
        setAgentStats(stats);

        // Refresh token balance as agents might receive tokens
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Error collecting waste:', error);
      throw error;
    }
  };

  const handleApproveWaste = async (reportId: number) => {
    try {
      await contracts.approveWaste(reportId);
      // Refresh agent stats and token balance
      if (account) {
        const stats = await contracts.getAgentStats(account);
        setAgentStats(stats);

        // Refresh token balance as agents might receive tokens
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Error approving waste:', error);
      throw error;
    }
  };

  const handleRejectWaste = async (reportId: number, reason: string) => {
    try {
      await contracts.rejectWaste(reportId, reason);
      // Refresh agent stats
      if (account) {
        const stats = await contracts.getAgentStats(account);
        setAgentStats(stats);
      }
    } catch (error) {
      console.error('Error rejecting waste:', error);
      throw error;
    }
  };

  const handlePurchasePoints = async (amount: string) => {
    try {
      await contracts.purchasePoints(amount);
      // Refresh token balance
      if (account) {
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Error purchasing points:', error);
      throw error;
    }
  };

  const refreshTokenBalance = async () => {
    if (account) {
      try {
        const balance = await contracts.getTokenBalance(account);
        setTokenBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Error refreshing token balance:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAccount(null);
        setIsUser(false);
        setIsAgent(false);
        setNeedsRegistration(false);
        setUserStats(null);
        setAgentStats(null);
        setTokenBalance('0');
      } else {
        // User switched accounts
        const newAccount = accounts[0];
        setAccount(newAccount);

        let userRegistered = false;
        let agentRegistered = false;

        // Refresh user data
        try {
          const stats = await contracts.getUserStats(newAccount);
          userRegistered = !!(stats && stats.username && stats.username.length > 0);
          setIsUser(userRegistered);
          setUserStats(stats);
        } catch (error) {
          console.log('User not registered yet:', error);
          setIsUser(false);
          setUserStats(null);
        }

        // Refresh agent data
        try {
          const agentStats = await contracts.getAgentStats(newAccount);
          agentRegistered = !!(agentStats && agentStats.isVerified);
          setIsAgent(agentRegistered);
          setAgentStats(agentStats);
        } catch (error) {
          console.log('Not an agent:', error);
          setIsAgent(false);
          setAgentStats(null);
        }

        // Refresh token balance
        try {
          const balance = await contracts.getTokenBalance(newAccount);
          setTokenBalance(ethers.formatEther(balance));
        } catch (error) {
          console.log('Error getting token balance:', error);
          setTokenBalance('0');
        }

        // Set needsRegistration if the user is not registered as either a user or an agent
        const needsReg = !userRegistered && !agentRegistered;
        setNeedsRegistration(needsReg);

        // Show info message if registration is needed
        if (needsReg) {
          toast.info('Please complete your registration');
        }
      }
    };

    // Check if MetaMask is installed
    if (window.ethereum) {
      // Add event listener for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);
    }

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const disconnectWallet = () => {
    // Clear all state
    setAccount(null);
    setIsUser(false);
    setIsAgent(false);
    setNeedsRegistration(false);
    setUserStats(null);
    setAgentStats(null);
    setTokenBalance('0');

    // Show toast notification
    toast.success('Wallet disconnected');

    // Note: This doesn't actually disconnect the wallet from the dApp
    // It just clears our local state
    // MetaMask doesn't provide a direct method to disconnect
  };

  const value = {
    account,
    isUser,
    isAgent,
    needsRegistration,
    userStats,
    agentStats,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    registerUser: handleRegisterUser,
    registerAgent: handleRegisterAgent,
    reportWaste: handleReportWaste,
    collectWaste: handleCollectWaste,
    approveWaste: handleApproveWaste,
    rejectWaste: handleRejectWaste,
    purchasePoints: handlePurchasePoints,
    refreshTokenBalance,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

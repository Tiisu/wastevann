
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useWallet, formatAddress } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { Wallet, ArrowUpRight, Award, TrendingUp } from 'lucide-react';
import { getUserWasteReports } from '@/utils/contracts';
import { useContract } from '@/context/ContractContext';
import { ethers } from 'ethers';

interface Transaction {
  id: number;
  type: 'Earned' | 'Sent' | 'Received';
  amount: number;
  timestamp: number;
  address: string;
  description: string;
  status?: number; // 0: Pending, 1: Approved, 2: Rejected
  rejectionReason?: string;
}

const TokenWallet: React.FC = () => {
  const { account, connectWallet, isConnecting } = useWallet();
  const { tokenBalance: contextTokenBalance, refreshTokenBalance, isAgent, agentStats } = useContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchWalletData();
    } else {
      setLoading(false);
    }
  }, [account]);

  const fetchWalletData = async () => {
    if (!account) return;

    setLoading(true);
    try {
      // Refresh token balance from context
      await refreshTokenBalance();

      // Get waste reports from blockchain
      await fetchWasteReports(account);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data from blockchain");
    } finally {
      setLoading(false);
    }
  };

  const fetchWasteReports = async (address: string) => {
    try {
      const reports = await getUserWasteReports(address);

      // Convert waste reports to transaction format
      const txs: Transaction[] = reports.map(report => {
        // Map verification status: 0: Pending, 1: Approved, 2: Rejected
        let statusText = 'Pending';
        if (report.status === 1) {
          statusText = 'Approved';
        } else if (report.status === 2) {
          statusText = 'Rejected';
        }

        let description = `Waste report: ${report.wasteType} (${report.quantity} kg) - ${statusText}`;
        if (report.status === 2 && report.rejectionReason) {
          description += ` (${report.rejectionReason})`;
        }

        return {
          id: Number(report.reportId),
          type: 'Earned',
          amount: report.status === 1 ? Number(report.tokenReward) / 1e18 : 0, // Convert from wei to tokens
          timestamp: Number(report.timestamp) * 1000, // Convert from seconds to milliseconds
          address: report.collectedBy || "0x0000000000000000000000000000000000000000",
          description,
          status: report.status, // Store the numeric status for easier checking
          rejectionReason: report.rejectionReason
        };
      });

      // Sort by timestamp (newest first)
      txs.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching waste reports:", error);
      toast.error("Failed to load waste reports from blockchain");
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Token Wallet
          </h1>
          <p className="mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Manage your WasteVan tokens and view your transaction history.
          </p>
        </div>

        {!account ? (
          <div className="text-center max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-10">
            <Wallet className="h-16 w-16 mx-auto text-waste-600 dark:text-waste-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please connect your Ethereum wallet to view your tokens and transaction history.
            </p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-waste-600 hover:bg-waste-700 text-white"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-waste-50 dark:bg-waste-900">
                  <CardTitle>Wallet Balance</CardTitle>
                  <CardDescription>Your current WasteVan token balance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-4 p-3 bg-waste-100 dark:bg-waste-800 rounded-full">
                        <Wallet className="h-8 w-8 text-waste-600 dark:text-waste-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-waste-600 dark:text-waste-400">
                          {parseFloat(contextTokenBalance).toLocaleString()} WVT
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Connected: {formatAddress(account)}
                          {isAgent && <span className="ml-2 text-xs bg-waste-100 text-waste-800 px-2 py-1 rounded">Agent</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-waste-50 dark:bg-waste-900">
                  <CardTitle>Token Actions</CardTitle>
                  <CardDescription>Manage your tokens and view blockchain data</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={fetchWalletData}
                      disabled={loading}
                      className="bg-waste-600 hover:bg-waste-700 text-white"
                    >
                      {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-waste-500 text-waste-700 hover:bg-waste-50 hover:text-waste-800"
                      onClick={() => {
                        if (account) {
                          // Open etherscan or similar explorer based on network
                          window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
                        }
                      }}
                    >
                      View on Explorer <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Stats Card - Only show for agents */}
              {isAgent && agentStats && (
                <Card>
                  <CardHeader className="bg-green-50 dark:bg-green-900">
                    <CardTitle>Agent Statistics</CardTitle>
                    <CardDescription>Your waste collection performance</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-green-100 dark:bg-green-800 rounded-full">
                          <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {agentStats.totalCollections?.toString() || '0'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Collections
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {agentStats.points?.toString() || '0'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Points
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader className="bg-waste-50 dark:bg-waste-900">
                <CardTitle>Waste Reports & Rewards</CardTitle>
                <CardDescription>Your waste reports and token rewards from the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Tokens (WVT)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full
                                ${tx.status === 1 ?
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  tx.status === 2 ?
                                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                            >
                              {tx.status === 1 ? 'Approved' : tx.status === 2 ? 'Rejected' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={
                              tx.status === 1 ? "text-green-600 dark:text-green-400" :
                              tx.status === 2 ? "text-red-600 dark:text-red-400" :
                              "text-gray-600 dark:text-gray-400"
                            }>
                              {tx.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No waste reports found. Start reporting waste to earn tokens!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TokenWallet;

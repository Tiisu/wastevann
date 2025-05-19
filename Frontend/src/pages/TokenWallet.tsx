
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useWallet, formatAddress } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { Wallet, ArrowUpRight } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'Earned' | 'Sent' | 'Received';
  amount: number;
  timestamp: number;
  address: string;
  description: string;
}

const TokenWallet: React.FC = () => {
  const { account, connectWallet, isConnecting } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
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
    setLoading(true);
    try {
      // In a real app, this would call the blockchain
      // Mock data for demonstration
      setTokenBalance(157.35);
      setTransactions([
        {
          id: 1,
          type: 'Earned',
          amount: 25,
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          address: "0x0000000000000000000000000000000000000000",
          description: "Waste collection reward"
        },
        {
          id: 2,
          type: 'Earned',
          amount: 32.5,
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
          address: "0x0000000000000000000000000000000000000000",
          description: "Waste collection reward"
        },
        {
          id: 3,
          type: 'Received',
          amount: 100,
          timestamp: Date.now() - 86400000 * 10, // 10 days ago
          address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          description: "Initial allocation"
        },
      ]);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
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
                          {tokenBalance?.toLocaleString()} WVT
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Connected: {formatAddress(account)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-waste-50 dark:bg-waste-900">
                  <CardTitle>Token Actions</CardTitle>
                  <CardDescription>Send, receive, or exchange your tokens</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-waste-600 hover:bg-waste-700 text-white">
                      Send Tokens
                    </Button>
                    <Button variant="outline" className="border-waste-500 text-waste-700 hover:bg-waste-50 hover:text-waste-800">
                      View on Explorer <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="bg-waste-50 dark:bg-waste-900">
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent token transactions</CardDescription>
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
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount (WVT)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell>
                            <span 
                              className={`inline-block px-2 py-1 text-xs rounded-full
                                ${tx.type === 'Earned' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                  tx.type === 'Sent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}
                            >
                              {tx.type}
                            </span>
                          </TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell className="text-right font-medium">
                            <span 
                              className={`
                                ${tx.type === 'Sent' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
                              `}
                            >
                              {tx.type === 'Sent' ? '-' : '+'}{tx.amount}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
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

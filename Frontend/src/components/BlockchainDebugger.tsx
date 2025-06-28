import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import * as contracts from '@/utils/contracts';
import { useContract } from '@/context/ContractContext';
import { verifyContractSetup } from '@/utils/contractVerification';

const BlockchainDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { account, registerUser, registerAgent } = useContract();

  const runDiagnostics = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    const info: any = {};

    try {
      // Run contract setup verification
      const setupResults = await verifyContractSetup();
      info.setupVerification = setupResults;

      // Test contract connection
      const { wasteVan, wasteVanToken } = await contracts.getContract();
      info.contractConnection = "✅ Connected";

      // Get basic contract info
      info.tokenName = await wasteVanToken.name();
      info.tokenSymbol = await wasteVanToken.symbol();
      info.reportCounter = await wasteVan.reportCounter();

      // Check user registration
      const userStats = await contracts.getUserStats(account);
      info.userRegistered = userStats && userStats.username && userStats.username.length > 0;
      info.userStats = userStats;

      // Check agent status
      const agentStats = await contracts.getAgentStats(account);
      info.isAgent = agentStats && agentStats.isVerified;
      info.agentStats = agentStats;

      // Get token balance
      const balance = await contracts.getTokenBalance(account);
      info.tokenBalance = balance.toString();

      // Test fetching reports
      const userReports = await contracts.getUserWasteReports(account);
      info.userReportsCount = userReports.length;
      info.userReports = userReports;

      const allReports = await contracts.getAllWasteReports();
      info.totalReportsCount = allReports.length;
      info.allReports = allReports;

      setDebugInfo(info);
      toast.success("Diagnostics completed successfully");
    } catch (error) {
      console.error("Diagnostics error:", error);
      info.error = error.message;
      setDebugInfo(info);
      toast.error("Diagnostics failed - check console for details");
    } finally {
      setLoading(false);
    }
  };

  const quickRegisterUser = async () => {
    try {
      await registerUser("TestUser", "test@example.com");
      toast.success("Registered as user! Run diagnostics again to see the change.");
    } catch (error) {
      toast.error("Failed to register as user");
    }
  };

  const quickRegisterAgent = async () => {
    try {
      await registerAgent();
      toast.success("Registered as agent! Run diagnostics again to see the change.");
    } catch (error) {
      toast.error("Failed to register as agent");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Blockchain Diagnostics</CardTitle>
        <CardDescription>
          Debug tool to check smart contract integration and data fetching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={runDiagnostics} 
            disabled={loading || !account}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Running Diagnostics..." : "Run Diagnostics"}
          </Button>
          
          {account && (
            <>
              <Button 
                onClick={quickRegisterUser} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Quick Register User
              </Button>
              <Button 
                onClick={quickRegisterAgent} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Quick Register Agent
              </Button>
            </>
          )}
          
          {!account && (
            <Badge variant="destructive">Wallet not connected</Badge>
          )}
        </div>

        {debugInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Contract Connection</h3>
                <p className="text-sm">{debugInfo.contractConnection || "❌ Failed"}</p>
                {debugInfo.tokenName && (
                  <p className="text-sm">Token: {debugInfo.tokenName} ({debugInfo.tokenSymbol})</p>
                )}
                <p className="text-sm">Total Reports: {debugInfo.reportCounter?.toString() || "0"}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">User Status</h3>
                <p className="text-sm">
                  Registered: {debugInfo.userRegistered ? "✅ Yes" : "❌ No"}
                </p>
                <p className="text-sm">
                  Agent: {debugInfo.isAgent ? "✅ Yes" : "❌ No"}
                </p>
                <p className="text-sm">
                  Token Balance: {debugInfo.tokenBalance ? (Number(debugInfo.tokenBalance) / 1e18).toFixed(2) + " WVT" : "0 WVT"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">User Reports</h3>
                <p className="text-sm">Count: {debugInfo.userReportsCount || 0}</p>
                {debugInfo.userReports && debugInfo.userReports.length > 0 && (
                  <div className="text-xs space-y-1">
                    {debugInfo.userReports.map((report: any, index: number) => (
                      <div key={index} className="bg-gray-100 p-2 rounded">
                        Report #{report.reportId}: {report.wasteType} ({report.quantity}kg) - Status: {report.status}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">All Reports</h3>
                <p className="text-sm">Count: {debugInfo.totalReportsCount || 0}</p>
                {debugInfo.allReports && debugInfo.allReports.length > 0 && (
                  <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                    {debugInfo.allReports.map((report: any, index: number) => (
                      <div key={index} className="bg-gray-100 p-2 rounded">
                        Report #{report.reportId}: {report.wasteType} ({report.quantity}kg) - Reporter: {report.reporter.substring(0, 8)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {debugInfo.error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                <p className="text-sm text-red-700">{debugInfo.error}</p>
              </div>
            )}

            <details className="bg-gray-50 p-4 rounded">
              <summary className="font-semibold cursor-pointer">Raw Debug Data</summary>
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(debugInfo, (key, value) => 
                  typeof value === 'bigint' ? value.toString() + 'n' : value, 2
                )}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainDebugger;
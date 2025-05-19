
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle, Loader2 } from 'lucide-react';
import { PlasticType, WasteReport } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import * as contracts from '@/utils/contracts';
import { useContract } from '@/context/ContractContext';

const AgentDashboard: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { collectWaste } = useContract();

  // Function to fetch waste reports from blockchain
  const fetchWasteReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all waste reports from the blockchain
      const blockchainReports = await contracts.getAllWasteReports();

      // Map blockchain reports to the WasteReport interface
      const mappedReports: WasteReport[] = blockchainReports.map(report => {
        // Convert wasteType string to PlasticType enum
        let plasticType = PlasticType.OTHER;
        switch(report.wasteType) {
          case "PET": plasticType = PlasticType.PET; break;
          case "HDPE": plasticType = PlasticType.HDPE; break;
          case "PVC": plasticType = PlasticType.PVC; break;
          case "LDPE": plasticType = PlasticType.LDPE; break;
          case "PP": plasticType = PlasticType.PP; break;
          case "PS": plasticType = PlasticType.PS; break;
        }

        return {
          id: Number(report.reportId),
          plasticType,
          quantity: Number(report.quantity),
          location: "Location data not available", // Location might not be stored on-chain
          timestamp: Number(report.timestamp) * 1000, // Convert to milliseconds
          rewardEstimate: Number(report.tokenReward),
          reporter: report.reporter,
          status: report.isCollected ? 'collected' : 'pending'
        };
      });

      setReports(mappedReports);
      toast.success("Waste reports loaded from blockchain");
    } catch (err) {
      console.error("Error fetching waste reports:", err);
      setError("Failed to load waste reports from blockchain. Please try again later.");
      toast.error("Failed to load waste reports from blockchain");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchWasteReports();
  }, []);

  const getPlasticTypeName = (type: PlasticType): string => {
    switch(type) {
      case PlasticType.PET: return "PET";
      case PlasticType.HDPE: return "HDPE";
      case PlasticType.PVC: return "PVC";
      case PlasticType.LDPE: return "LDPE";
      case PlasticType.PP: return "PP";
      case PlasticType.PS: return "PS";
      case PlasticType.OTHER: return "Other";
    }
  };

  const startScanQR = (reportId: number) => {
    setIsScanning(true);
    setSelectedReportId(reportId);

    // In a real implementation, you would scan a QR code here
    // For now, we'll simulate the scan and call the blockchain directly
    handleCollectWaste(reportId);
  };

  const handleCollectWaste = async (reportId: number) => {
    try {
      // Call the smart contract to collect waste
      await collectWaste(reportId);

      toast.success("Waste collection verified on blockchain!");

      // Refresh the reports to get the updated status from the blockchain
      await fetchWasteReports();
    } catch (err) {
      console.error("Error collecting waste:", err);
      toast.error("Failed to verify waste collection on blockchain");
    } finally {
      setIsScanning(false);
      setSelectedReportId(null);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const nearbyReports = reports.filter(report => report.status === 'pending');
  const collectedReports = reports.filter(report => report.status === 'collected');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Agent Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
                View and collect nearby waste reports to earn rewards.
              </p>
            </div>
            <Button
              onClick={fetchWasteReports}
              disabled={isLoading}
              className="bg-waste-600 hover:bg-waste-700 text-white"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Refreshing...</>
              ) : (
                <>Refresh Reports</>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-waste-600" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading waste reports from blockchain...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Nearby Waste Reports
              </h2>
              {nearbyReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="bg-waste-50 dark:bg-waste-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Report #{report.id}</CardTitle>
                            <CardDescription>
                              {formatTimestamp(report.timestamp)}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-waste-100 dark:bg-waste-800 text-waste-800 dark:text-waste-200">
                            {report.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Plastic Type:</span>
                            <span className="font-medium">{getPlasticTypeName(report.plasticType)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Quantity:</span>
                            <span className="font-medium">{report.quantity} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Reporter:</span>
                            <span className="font-medium truncate max-w-[150px]">{report.reporter.substring(0, 6)}...{report.reporter.substring(report.reporter.length - 4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Reward:</span>
                            <span className="font-medium text-waste-600 dark:text-waste-400">
                              {report.rewardEstimate} WVT
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => startScanQR(report.id)}
                          disabled={isScanning && selectedReportId === report.id}
                          className="w-full bg-waste-600 hover:bg-waste-700 text-white"
                        >
                          {isScanning && selectedReportId === report.id ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying Collection...</>
                          ) : (
                            <><QrCode className="h-4 w-4 mr-2" /> Verify Collection</>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No pending waste reports in your area.</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recently Collected
              </h2>
              {collectedReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collectedReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="bg-green-50 dark:bg-green-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Report #{report.id}</CardTitle>
                            <CardDescription>
                              {formatTimestamp(report.timestamp)}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" /> {report.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Plastic Type:</span>
                            <span className="font-medium">{getPlasticTypeName(report.plasticType)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Quantity:</span>
                            <span className="font-medium">{report.quantity} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Reporter:</span>
                            <span className="font-medium truncate max-w-[150px]">{report.reporter.substring(0, 6)}...{report.reporter.substring(report.reporter.length - 4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Reward:</span>
                            <span className="font-medium text-waste-600 dark:text-waste-400">
                              {report.rewardEstimate} WVT
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No waste collections completed yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboard;

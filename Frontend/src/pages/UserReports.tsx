import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, CheckCircle, X, Recycle } from 'lucide-react';
import { PlasticType, WasteReport } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import * as contracts from '@/utils/contracts';
import { useContract } from '@/context/ContractContext';
import ChatModal from '@/components/ChatModal';
import MessageNotification from '@/components/MessageNotification';
import { getIPFSGatewayUrl } from '@/utils/ipfsUtils';
import LoadingSpinner from '@/components/ui/loading-spinner';

const UserReports: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatReport, setSelectedChatReport] = useState<WasteReport | null>(null);
  const { account } = useContract();

  useEffect(() => {
    if (account) {
      fetchUserReports();
    }
  }, [account]);

  const fetchUserReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("User Reports: Fetching user's waste reports from blockchain...");
      // Get all waste reports from the blockchain
      const allReports = await contracts.getAllWasteReports();
      
      // Filter reports for the current user
      const userReports = allReports.filter(report => 
        report.reporter.toLowerCase() === account?.toLowerCase()
      );

      // Map blockchain reports to the WasteReport interface
      const mappedReports: WasteReport[] = userReports.map(report => {
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
          id: report.reportId,
          reporter: report.reporter,
          ipfsHash: report.ipfsHash,
          quantity: report.quantity,
          plasticType: plasticType,
          location: report.location,
          timestamp: report.timestamp,
          status: report.status === 0 ? 'pending' : report.status === 1 ? 'collected' : 'rejected',
          collectedBy: report.collectedBy !== '0x0000000000000000000000000000000000000000' ? report.collectedBy : undefined,
          rewardEstimate: Number(report.tokenReward.toString()) / (10 ** 18), // Convert BigInt to string first, then to number, then to tokens
          rejectionReason: report.rejectionReason || undefined
        };
      });

      // Sort by timestamp (newest first)
      mappedReports.sort((a, b) => b.timestamp - a.timestamp);

      setReports(mappedReports);
      console.log(`User Reports: Found ${mappedReports.length} reports for user`);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      setError('Failed to load your waste reports');
      toast.error('Failed to load your waste reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = (report: WasteReport) => {
    setSelectedChatReport(report);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedChatReport(null);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getPlasticTypeName = (type: PlasticType): string => {
    switch (type) {
      case PlasticType.PET: return 'PET';
      case PlasticType.HDPE: return 'HDPE';
      case PlasticType.PVC: return 'PVC';
      case PlasticType.LDPE: return 'LDPE';
      case PlasticType.PP: return 'PP';
      case PlasticType.PS: return 'PS';
      default: return 'Other';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'collected':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> Collected
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-waste-50 dark:from-gray-900 dark:via-gray-800 dark:to-waste-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Please connect your wallet to view your waste reports.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-waste-50 dark:from-gray-900 dark:via-gray-800 dark:to-waste-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-waste-600 to-waste-400 rounded-xl flex items-center justify-center">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold gradient-text sm:text-5xl">
                My Waste Reports
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Track your submissions and chat with agents
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center">
                  <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Error Loading Reports</h2>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchUserReports}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Reports Yet</h2>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any waste reports yet. Start making an impact!
                  </p>
                  <Button onClick={() => window.location.href = '/report-waste'}>
                    Report Waste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className={`${
                  report.status === 'collected' ? 'bg-green-50 dark:bg-green-900' :
                  report.status === 'rejected' ? 'bg-red-50 dark:bg-red-900' :
                  'bg-yellow-50 dark:bg-yellow-900'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Report #{report.id}</CardTitle>
                      <CardDescription>
                        {formatTimestamp(report.timestamp)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {/* Waste Image */}
                  {report.ipfsHash && (
                    <div className="mb-4">
                      <img
                        src={getIPFSGatewayUrl(report.ipfsHash)}
                        alt="Waste"
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

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
                      <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-right max-w-[150px] truncate">{report.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Reward:</span>
                      <span className="font-medium text-waste-600 dark:text-waste-400">
                        {report.rewardEstimate} WVT
                      </span>
                    </div>
                    
                    {report.collectedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Collected by:</span>
                        <span className="font-medium text-right max-w-[150px] truncate">
                          {report.collectedBy.substring(0, 6)}...{report.collectedBy.substring(report.collectedBy.length - 4)}
                        </span>
                      </div>
                    )}

                    {report.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">Rejection Reason:</span>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{report.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleOpenChat(report)}
                    variant="outline"
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {report.status === 'collected' && report.collectedBy ? 'Chat with Agent' : 'Chat with Agents'}
                    <MessageNotification 
                      reportId={report.id} 
                      className="ml-2"
                    />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />

      {/* Chat Modal */}
      {showChatModal && selectedChatReport && (
        <ChatModal
          isOpen={showChatModal}
          onClose={handleCloseChat}
          reportId={selectedChatReport.id}
          reporterAddress={selectedChatReport.reporter}
          collectedBy={selectedChatReport.collectedBy}
        />
      )}
    </div>
  );
};

export default UserReports;
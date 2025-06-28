
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle, Loader2, MapPin, Filter, Check, X, Recycle, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { PlasticType, WasteReport } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import * as contracts from '@/utils/contracts';
import { useContract } from '@/context/ContractContext';
import QRScannerModal from '@/components/QRScannerModal';
import RejectWasteModal from '@/components/RejectWasteModal';
import ChatModal from '@/components/ChatModal';
import MessageNotification from '@/components/MessageNotification';
import { getIPFSGatewayUrl } from '@/utils/ipfsUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent, EnhancedCardFooter } from '@/components/ui/enhanced-card';


const AgentDashboard: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatReport, setSelectedChatReport] = useState<WasteReport | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [processingReportId, setProcessingReportId] = useState<number | null>(null);
  const { collectWaste, approveWaste, rejectWaste } = useContract();

  // Function to fetch waste reports from blockchain
  const fetchWasteReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Agent Dashboard: Fetching all waste reports from blockchain...");
      // Get all waste reports from the blockchain
      const blockchainReports = await contracts.getAllWasteReports();
      console.log(`Agent Dashboard: Retrieved ${blockchainReports.length} reports:`, blockchainReports);

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

        // Map verification status: 0: Pending, 1: Approved, 2: Rejected
        let status: 'pending' | 'collected' | 'verified' | 'rejected' = 'pending';
        if (report.status === 1) {
          status = 'collected'; // Approved/Collected
        } else if (report.status === 2) {
          status = 'rejected'; // Rejected
        }


        return {
          id: Number(report.reportId.toString()),
          plasticType,
          quantity: Number(report.quantity.toString()),
          location: report.location, // Use location from blockchain if available
          timestamp: Number(report.timestamp.toString()) * 1000, // Convert to milliseconds
          rewardEstimate: Number(report.tokenReward.toString()) / 1e18, // Convert from wei to ether
          reporter: report.reporter,
          status,
          ipfsHash: report.ipfsHash, // Store IPFS hash for image viewing
          rejectionReason: report.rejectionReason || undefined
        };
      });

      console.log(`Agent Dashboard: Mapped ${mappedReports.length} reports:`, mappedReports);
      setReports(mappedReports);
      
      if (mappedReports.length > 0) {
        toast.success(`Loaded ${mappedReports.length} waste reports from blockchain`);
      } else {
        toast.info("No waste reports found in the system");
      }
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

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Use effect to get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const startScanQR = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
    setSelectedReportId(null);
  };

  const handleConfirmCollection = async (reportData: any, reportId: number) => {
    try {
      setIsScanning(true);

      // Verify that the QR code data matches the report
      const report = reports.find(r => r.id === reportId);

      if (!report) {
        throw new Error("Report not found");
      }

      // Call the smart contract to collect waste
      await collectWaste(reportId);

      toast.success("Waste collection verified on blockchain!");

      // Refresh the reports to get the updated status from the blockchain
      await fetchWasteReports();
    } catch (err) {
      console.error("Error collecting waste:", err);
      toast.error("Failed to verify waste collection on blockchain");
      throw err; // Re-throw to be caught by the QR scanner modal
    } finally {
      setIsScanning(false);
      setSelectedReportId(null);
    }
  };

  // Manual approval handler
  const handleManualApprove = async (reportId: number) => {
    try {
      setProcessingReportId(reportId);
      await approveWaste(reportId);
      toast.success("Waste approved successfully!");
      await fetchWasteReports();
    } catch (err) {
      console.error("Error approving waste:", err);
      toast.error("Failed to approve waste");
    } finally {
      setProcessingReportId(null);
    }
  };

  // Manual rejection handlers
  const handleStartReject = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedReportId(null);
  };

  const handleManualReject = async (reason: string) => {
    if (!selectedReportId) return;

    try {
      await rejectWaste(selectedReportId, reason);
      toast.success("Waste rejected successfully!");
      await fetchWasteReports();
    } catch (err) {
      console.error("Error rejecting waste:", err);
      toast.error("Failed to reject waste");
      throw err; // Re-throw to be caught by the reject modal
    }
  };

  // Chat handlers
  const handleOpenChat = (report: WasteReport) => {
    setSelectedChatReport(report);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedChatReport(null);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Filter reports by location if a filter is set

  const filteredReports = locationFilter
    ? reports.filter(report =>
        report.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    : reports;

  const nearbyReports = filteredReports.filter(report => report.status === 'pending');
  const collectedReports = filteredReports.filter(report => report.status === 'collected');
  const rejectedReports = filteredReports.filter(report => report.status === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-waste-50 dark:from-gray-900 dark:via-gray-800 dark:to-waste-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-waste-600 to-waste-400 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold gradient-text sm:text-5xl">
                    Agent Dashboard
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Agent</span>
                  </div>
                </div>
              </div>
              <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                View and collect nearby waste reports to earn rewards and help create a cleaner environment.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 lg:min-w-[300px] animate-fade-in" style={{animationDelay: '0.2s'}}>
              <EnhancedCard variant="glass" padding="sm" className="text-center">
                <div className="text-2xl font-bold gradient-text">{nearbyReports.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending</div>
              </EnhancedCard>
              <EnhancedCard variant="glass" padding="sm" className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{collectedReports.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Collected</div>
              </EnhancedCard>
              <EnhancedCard variant="glass" padding="sm" className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedReports.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rejected</div>
              </EnhancedCard>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button
              onClick={fetchWasteReports}
              disabled={isLoading}
              className="bg-gradient-to-r from-waste-600 to-waste-500 hover:from-waste-700 hover:to-waste-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Refreshing...</>
              ) : (
                <><TrendingUp className="h-4 w-4 mr-2" /> Refresh Reports</>
              )}
            </Button>
          </div>

          {/* Location filter */}
          <EnhancedCard variant="glass" className="mt-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <EnhancedCardHeader icon={<MapPin className="h-5 w-5 text-waste-600" />}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location Filter</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Filter waste reports by location</p>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="location-filter" className="mb-2 block font-medium">Search Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="location-filter"
                      placeholder="Enter location to filter reports..."
                      className="pl-10 rounded-xl border-2 focus:border-waste-500"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setLocationFilter('')}
                    disabled={!locationFilter}
                    className="rounded-xl border-2 hover:border-waste-500"
                  >
                    Clear
                  </Button>
                  {currentLocation && (
                    <Button
                      variant="outline"
                      className="flex items-center rounded-xl border-2 hover:border-waste-500"
                      onClick={() => setLocationFilter(currentLocation)}
                    >
                      <MapPin className="h-4 w-4 mr-2" /> Use My Location
                    </Button>
                  )}
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner
              size="xl"
              variant="dots"
              text="Loading waste reports from blockchain..."
              className="animate-fade-in"
            />
          </div>
        ) : error ? (
          <EnhancedCard variant="glass" className="text-center py-12 border-red-200 dark:border-red-800">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Reports</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 Retry
            </Button>
          </EnhancedCard>
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
                      <CardFooter className="flex flex-col gap-2">
                        {/* QR Code Verification Button */}
                        <Button
                          onClick={() => startScanQR(report.id)}
                          disabled={isScanning && selectedReportId === report.id}
                          className="w-full bg-waste-600 hover:bg-waste-700 text-white"
                        >
                          {isScanning && selectedReportId === report.id ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying Collection...</>
                          ) : (
                            <><QrCode className="h-4 w-4 mr-2" /> Scan QR Code</>
                          )}
                        </Button>

                        {/* Manual Verification Buttons */}
                        <div className="flex gap-2 w-full">
                          <Button
                            onClick={() => handleManualApprove(report.id)}
                            disabled={processingReportId === report.id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            {processingReportId === report.id ? (
                              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Approving...</>
                            ) : (
                              <><Check className="h-4 w-4 mr-2" /> Approve</>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleStartReject(report.id)}
                            disabled={processingReportId === report.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" /> Reject
                          </Button>
                        </div>

                        {/* Chat Button */}
                        <Button
                          onClick={() => handleOpenChat(report)}
                          variant="outline"
                          className="w-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat with Reporter
                          <MessageNotification 
                            reportId={report.id} 
                            className="ml-2"
                          />
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
                      <CardFooter>
                        <Button
                          onClick={() => handleOpenChat(report)}
                          variant="outline"
                          className="w-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat with Reporter
                          <MessageNotification 
                            reportId={report.id} 
                            className="ml-2"
                          />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No waste collections completed yet.</p>
                </div>
              )}
            </div>

            {/* Rejected Reports Section */}
            {rejectedReports.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Rejected Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="bg-red-50 dark:bg-red-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Report #{report.id}</CardTitle>
                            <CardDescription>
                              {formatTimestamp(report.timestamp)}
                            </CardDescription>
                          </div>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                            <X className="h-3 w-3 mr-1" /> {report.status}
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
                          {report.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">Rejection Reason:</span>
                              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{report.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />

      {/* QR Scanner Modal */}
      {showQRScanner && selectedReportId && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={handleCloseQRScanner}
          onConfirmCollection={handleConfirmCollection}
          reportId={selectedReportId}
        />
      )}

      {/* Reject Waste Modal */}
      {showRejectModal && selectedReportId && (
        <RejectWasteModal
          isOpen={showRejectModal}
          onClose={handleCloseRejectModal}
          onReject={handleManualReject}
          reportId={selectedReportId}
        />
      )}

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

export default AgentDashboard;

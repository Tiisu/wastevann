
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle } from 'lucide-react';
import { mockWasteReports, PlasticType, WasteReport } from '@/utils/web3Utils';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const AgentDashboard: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>(mockWasteReports);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

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
    
    // Mock scanner behavior
    setTimeout(() => {
      completeScan(reportId);
    }, 2000);
  };

  const completeScan = (reportId: number) => {
    setIsScanning(false);
    setSelectedReportId(null);
    
    // Update the report status
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'collected' } 
        : report
    ));
    
    toast.success("QR code scanned successfully! Collection verified.");
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Agent Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            View and collect nearby waste reports to earn rewards.
          </p>
        </div>

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
                          <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                          <span className="font-medium">{report.location}</span>
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
                          <>Scanning QR Code...</>
                        ) : (
                          <><QrCode className="h-4 w-4 mr-2" /> Scan QR Code</>
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
                          <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                          <span className="font-medium">{report.location}</span>
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
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboard;

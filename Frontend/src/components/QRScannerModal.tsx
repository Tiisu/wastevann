import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import QRCodeScanner from './QRCodeScanner';

interface WasteReportData {
  ipfsHash: string;
  plasticType: number;
  quantity: number;
  location: string;
  timestamp: string;
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCollection: (reportData: WasteReportData, reportId: number) => Promise<void>;
  reportId: number;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onConfirmCollection,
  reportId
}) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'confirming'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<WasteReportData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanSuccess = (data: string) => {
    try {
      // Parse the QR code data
      const parsedData = JSON.parse(data) as WasteReportData;
      
      // Validate the data
      if (!parsedData.ipfsHash || 
          parsedData.plasticType === undefined || 
          parsedData.quantity === undefined || 
          !parsedData.location || 
          !parsedData.timestamp) {
        setScanStatus('error');
        setScanError('Invalid QR code data. Missing required fields.');
        return;
      }
      
      // Set the scanned data and update status
      setScannedData(parsedData);
      setScanStatus('success');
    } catch (error) {
      setScanStatus('error');
      setScanError('Failed to parse QR code data. Please try again.');
      console.error('Error parsing QR code data:', error);
    }
  };

  const handleScanError = (error: string) => {
    setScanStatus('error');
    setScanError(error);
  };

  const handleConfirmCollection = async () => {
    if (!scannedData) return;
    
    try {
      setScanStatus('confirming');
      setIsProcessing(true);
      
      // Call the onConfirmCollection callback with the scanned data
      await onConfirmCollection(scannedData, reportId);
      
      // Close the modal after successful collection
      setTimeout(() => {
        onClose();
        // Reset state
        setScanStatus('idle');
        setScannedData(null);
        setScanError(null);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      setScanStatus('error');
      setScanError('Failed to collect waste. Please try again.');
      setIsProcessing(false);
      console.error('Error confirming collection:', error);
    }
  };

  const resetScan = () => {
    setScanStatus('idle');
    setScannedData(null);
    setScanError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Waste Collection</DialogTitle>
          <DialogDescription>
            Scan the QR code provided by the user to verify the waste collection.
          </DialogDescription>
        </DialogHeader>
        
        {scanStatus === 'idle' && (
          <QRCodeScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            onClose={onClose}
          />
        )}
        
        {scanStatus === 'success' && scannedData && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">QR Code Scanned Successfully</h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Plastic Type:</span>
                <span className="font-medium">{scannedData.plasticType}</span>
                
                <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                <span className="font-medium">{scannedData.quantity} kg</span>
                
                <span className="text-gray-500 dark:text-gray-400">Location:</span>
                <span className="font-medium truncate">{scannedData.location}</span>
                
                <span className="text-gray-500 dark:text-gray-400">Timestamp:</span>
                <span className="font-medium">{new Date(scannedData.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={resetScan} disabled={isProcessing}>
                Scan Again
              </Button>
              <Button 
                onClick={handleConfirmCollection} 
                className="bg-waste-600 hover:bg-waste-700 text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  'Confirm Collection'
                )}
              </Button>
            </div>
          </div>
        )}
        
        {scanStatus === 'error' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Scan Error</h3>
            <p className="text-center text-red-500">{scanError}</p>
            
            <div className="flex justify-center">
              <Button 
                onClick={resetScan} 
                className="bg-waste-600 hover:bg-waste-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {scanStatus === 'confirming' && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-waste-600 mb-2" />
              <p className="text-center">Verifying collection on blockchain...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerModal;

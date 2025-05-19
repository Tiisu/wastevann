import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Camera, X } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  onClose
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;

    setIsScanning(true);
    setError(null);

    try {
      await scannerRef.current.start(
        { facingMode: "environment" }, // Use the back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          // Handle success
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // QR code scanning is ongoing, ignore errors here
          console.log(errorMessage);
        }
      );
    } catch (err) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to start scanner: ${errorMessage}`);
      if (onScanError) onScanError(errorMessage);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Stop scanning after successful scan
    await stopScanner();
    
    try {
      // Try to parse the QR code data as JSON
      // If it's not valid JSON, pass it as is
      let parsedData;
      try {
        parsedData = JSON.parse(decodedText);
        // Pass the stringified version to ensure consistent handling
        onScanSuccess(JSON.stringify(parsedData));
      } catch (e) {
        // Not JSON, pass as is
        onScanSuccess(decodedText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Error processing QR code: ${errorMessage}`);
      if (onScanError) onScanError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scan QR Code</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            id={scannerContainerId} 
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden"
          >
            {!isScanning && !error && (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Click "Start Scanning" to scan a QR code
                </p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isScanning ? (
          <Button 
            onClick={startScanner} 
            className="w-full bg-waste-600 hover:bg-waste-700 text-white"
          >
            <Camera className="h-4 w-4 mr-2" /> Start Scanning
          </Button>
        ) : (
          <Button 
            onClick={stopScanner} 
            variant="outline" 
            className="w-full"
          >
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Stop Scanning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;

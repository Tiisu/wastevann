
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { QrCode, Download } from 'lucide-react';
import { PlasticType } from '@/utils/web3Utils';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  wasteData?: {
    ipfsHash: string;
    plasticType: PlasticType;
    quantity: number;
    location: string;
    timestamp: string;
  };
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, size = 200, wasteData }) => {
  // Generate QR code value based on waste data if available
  const qrValue = wasteData
    ? JSON.stringify(wasteData)
    : value || 'https://wastevan.example.com';
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `wastevan-qrcode-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
        <QrCode className="h-4 w-4 inline mr-2" /> Your Waste Report QR Code
      </h3>
      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG
          id="qr-code"
          value={qrValue}
          size={size}
          level="H" // High error correction capability
          includeMargin={true}
          imageSettings={{
            src: "https://wastevan.example.com/logo-small.png",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
        <canvas
          id="qr-code-canvas"
          style={{ display: 'none' }}
          width={size}
          height={size}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center max-w-xs">
        Show this code to a WasteVan agent when they collect your waste.
      </p>
      <Button
        onClick={downloadQRCode}
        className="mt-4 bg-waste-600 hover:bg-waste-700 text-white"
      >
        <Download className="h-4 w-4 mr-2" /> Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeGenerator;
